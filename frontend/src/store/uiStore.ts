import { create } from 'zustand';

interface UIState {
  isAIChatOpen: boolean;
  isCartOpen: boolean;
  selectedLocation: string;
  toggleAIChat: () => void;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setSelectedLocation: (loc: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAIChatOpen: false,
  isCartOpen: false,
  selectedLocation: 'Hitech City, Hyderabad',
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  openAIChat: () => set({ isAIChatOpen: true }),
  closeAIChat: () => set({ isAIChatOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
}));
