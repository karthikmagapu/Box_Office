import { create } from 'zustand';

export type SnackItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

interface CartState {
  items: { product: SnackItem; quantity: number }[];
  addItem: (product: SnackItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      return {
        items: state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    return { items: [...state.items, { product, quantity: 1 }] };
  }),
  removeItem: (productId) => set((state) => {
    const existing = state.items.find(i => i.product.id === productId);
    if (existing && existing.quantity > 1) {
      return {
        items: state.items.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
      };
    }
    return { items: state.items.filter(i => i.product.id !== productId) };
  }),
  clearCart: () => set({ items: [] }),
}));
