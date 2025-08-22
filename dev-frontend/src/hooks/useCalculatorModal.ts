import { create } from 'zustand';

interface CalculatorModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCalculatorModal = create<CalculatorModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));