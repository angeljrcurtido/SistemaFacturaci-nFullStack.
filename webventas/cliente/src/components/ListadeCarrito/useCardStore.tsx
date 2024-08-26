import create from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

interface CardState {
  cardNumber: string;
  cardHolder: string;
  cvc: string;
  expirationDate: string;
  setCardNumber: (cardNumber: string) => void;
  setCardHolder: (cardHolder: string) => void;
  setCVC: (cvc: string) => void;
  setExpirationDate: (expirationDate: string) => void;
  setCardData: (data: string[]) => void;  // Nueva función para establecer todos los valores
  clearCardData: () => void;
}

export const useCardStore = create<CardState>()(
  devtools(
    persist(
      (set) => ({
        cardNumber: '',
        cardHolder: '',
        cvc: '',
        expirationDate: '',
        setCardNumber: (cardNumber) => set({ cardNumber }),
        setCardHolder: (cardHolder) => set({ cardHolder }),
        setCVC: (cvc) => set({ cvc }),
        setExpirationDate: (expirationDate) => set({ expirationDate }),
        setCardData: (data: string[]) => set({
          cardNumber: data[0],
          cardHolder: data[1],
          cvc: data[2],
          expirationDate: data[3],
        }), // Asigna todos los valores a partir de un array
        clearCardData: () => set({
          cardNumber: '',
          cardHolder: '',
          cvc: '',
          expirationDate: '',
        }),
      }),
      {
        name: 'card-storage', // Nombre de la clave en localStorage
        storage: createJSONStorage(() => localStorage), // Usar localStorage
      }
    )
  )
);
