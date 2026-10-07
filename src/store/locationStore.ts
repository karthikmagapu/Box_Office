import { create } from 'zustand';

interface LocationState {
  city: string;
  setCity: (city: string) => void;
  initialize: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: 'Hyderabad', // Default city
  setCity: (city: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('box-office-city', city);
    }
    set({ city });
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('box-office-city');
      if (saved) {
        set({ city: saved });
      }
    }
  }
}));
