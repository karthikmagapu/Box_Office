import { create } from 'zustand';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type SeatInfo = {
  id: string;
  row: string;
  number: number;
  tier: string;
  price: number;
};

export type SnackCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

interface BookingState {
  showId: string | null;
  movieTitle: string | null;
  moviePoster: string | null;
  theatreName: string | null;
  showTime: string | null;
  showDate: string | null;
  showFormat: string | null;
  selectedSeats: SeatInfo[];
  bookingId: string | null;
  seatLockExpiresAt: number | null;
  selectedSnacks: SnackCartItem[];
  isUpgraded: boolean;
  appliedPromo: string | null;
  discountAmount: number;
  
  setShowDetails: (details: { theatreName: string, showTime: string, showDate: string, showFormat: string }) => void;
  toggleSeat: (seat: SeatInfo) => void;
  lockSeats: (movieTitle: string, moviePoster: string) => Promise<string>;
  addSnack: (snack: Omit<SnackCartItem, 'quantity'>) => void;
  removeSnack: (snackId: string) => void;
  updateSnackQuantity: (snackId: string, quantity: number) => void;
  saveSnacksToBooking: (bookingId: string) => Promise<void>;
  toggleUpgrade: (bookingId?: string) => Promise<void>;
  applyPromoCode: (code: string, bookingId?: string) => Promise<boolean>;
  removePromoCode: (bookingId?: string) => Promise<void>;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  showId: 'show-123',
  movieTitle: null,
  moviePoster: null,
  theatreName: null,
  showTime: null,
  showDate: null,
  showFormat: null,
  selectedSeats: [],
  bookingId: null,
  seatLockExpiresAt: null,
  selectedSnacks: [],
  isUpgraded: false,
  appliedPromo: null,
  discountAmount: 0,

  setShowDetails: (details) => set({ ...details }),

  toggleSeat: (seat) => {
    set((state) => {
      const exists = state.selectedSeats.find(s => s.id === seat.id);
      if (exists) {
        return { selectedSeats: state.selectedSeats.filter(s => s.id !== seat.id) };
      }
      if (state.selectedSeats.length >= 10) return state;
      return { selectedSeats: [...state.selectedSeats, seat] };
    });
  },

  lockSeats: async (movieTitle: string, moviePoster: string) => {
    const mockBookingId = `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    const state = get();
    const bookingDetails = {
      bookingId: mockBookingId,
      movieTitle,
      moviePoster,
      theatreName: state.theatreName,
      showTime: state.showTime,
      showDate: state.showDate,
      showFormat: state.showFormat,
      selectedSeats: state.selectedSeats,
      selectedSnacks: [],
      seatLockExpiresAt: expiresAt,
      isUpgraded: false,
      appliedPromo: null,
      discountAmount: 0,
      createdAt: Date.now()
    };

    set({ 
      bookingId: mockBookingId, 
      seatLockExpiresAt: expiresAt, 
      movieTitle, 
      moviePoster, 
      selectedSnacks: [],
      isUpgraded: false,
      appliedPromo: null,
      discountAmount: 0
    });

    try {
      const docRef = doc(db, 'bookings', mockBookingId);
      await setDoc(docRef, bookingDetails);
    } catch (error) {
      console.error("Error creating booking record in Firestore:", error);
    }

    return mockBookingId;
  },

  addSnack: (snack) => {
    set((state) => {
      const exists = state.selectedSnacks.find(s => s.id === snack.id);
      if (exists) {
        return {
          selectedSnacks: state.selectedSnacks.map(s =>
            s.id === snack.id ? { ...s, quantity: s.quantity + 1 } : s
          )
        };
      }
      return { selectedSnacks: [...state.selectedSnacks, { ...snack, quantity: 1 }] };
    });
  },

  removeSnack: (snackId) => {
    set((state) => ({
      selectedSnacks: state.selectedSnacks.filter(s => s.id !== snackId)
    }));
  },

  updateSnackQuantity: (snackId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { selectedSnacks: state.selectedSnacks.filter(s => s.id !== snackId) };
      }
      return {
        selectedSnacks: state.selectedSnacks.map(s =>
          s.id === snackId ? { ...s, quantity } : s
        )
      };
    });
  },

  saveSnacksToBooking: async (bookingId: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        selectedSnacks: get().selectedSnacks
      });
    } catch (error) {
      console.error("Error updating snacks in booking document:", error);
    }
  },

  toggleUpgrade: async (bookingId) => {
    const ticketCount = get().selectedSeats.length;
    const isNowUpgraded = !get().isUpgraded;

    let updatedSnacks = [...get().selectedSnacks];
    
    if (isNowUpgraded) {
      // Add Free Coke item
      const freeCoke: SnackCartItem = {
        id: 'free-coke',
        name: 'Chilled Coca-Cola (VIP Freebie)',
        price: 0,
        quantity: ticketCount,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=100&auto=format&fit=crop'
      };
      // remove any previous free-coke to prevent duplicates
      updatedSnacks = updatedSnacks.filter(s => s.id !== 'free-coke');
      updatedSnacks.push(freeCoke);
    } else {
      // Remove Free Coke item
      updatedSnacks = updatedSnacks.filter(s => s.id !== 'free-coke');
    }

    set({ isUpgraded: isNowUpgraded, selectedSnacks: updatedSnacks });

    if (bookingId) {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, {
          isUpgraded: isNowUpgraded,
          selectedSnacks: updatedSnacks
        });
      } catch (error) {
        console.error("Error updating VIP upgrade in Firestore:", error);
      }
    }
  },

  applyPromoCode: async (code, bookingId) => {
    const ticketCount = get().selectedSeats.length;
    const ticketTotal = get().selectedSeats.reduce((acc, s) => acc + s.price, 0);
    
    let discount = 0;
    const normalizedCode = code.toUpperCase().trim();

    if (normalizedCode === 'WEEKEND50') {
      discount = ticketCount * 50;
    } else if (normalizedCode === 'DISCOUNT10') {
      discount = Math.round(ticketTotal * 0.10);
    } else if (normalizedCode === 'WELCOME100') {
      discount = 100;
    } else {
      return false; // Code not valid
    }

    set({ appliedPromo: normalizedCode, discountAmount: discount });

    if (bookingId) {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, {
          appliedPromo: normalizedCode,
          discountAmount: discount
        });
      } catch (error) {
        console.error("Error applying promo in Firestore:", error);
      }
    }

    return true;
  },

  removePromoCode: async (bookingId) => {
    set({ appliedPromo: null, discountAmount: 0 });

    if (bookingId) {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, {
          appliedPromo: null,
          discountAmount: 0
        });
      } catch (error) {
        console.error("Error removing promo from Firestore:", error);
      }
    }
  },

  clearBooking: () => set({ 
    selectedSeats: [], 
    bookingId: null, 
    seatLockExpiresAt: null, 
    movieTitle: null, 
    moviePoster: null, 
    selectedSnacks: [],
    isUpgraded: false,
    appliedPromo: null,
    discountAmount: 0
  }),
}));

