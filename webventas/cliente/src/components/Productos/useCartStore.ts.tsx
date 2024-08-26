import create from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        totalItems: 0,
        addItem: (item) => set((state) => {
          const existingItem = state.items.find(i => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              totalItems: state.totalItems + 1,
            };
          } else {
            return { 
              items: [...state.items, { ...item, quantity: 1 }], 
              totalItems: state.totalItems + 1,
            };
          }
        }),
        removeItem: (id) => set((state) => {
          const itemToRemove = state.items.find(item => item.id === id);
          const quantityToRemove = itemToRemove ? itemToRemove.quantity : 0;
          return {
            items: state.items.filter((item) => item.id !== id),
            totalItems: state.totalItems - quantityToRemove,
          };
        }),
        
        increaseQuantity: (id) => set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          totalItems: state.totalItems + 1,
        })),
        decreaseQuantity: (id) => set((state) => ({
          items: state.items.map(item =>
            item.id === id && item.quantity > 1 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          ),
          totalItems: state.totalItems > 0 ? state.totalItems - 1 : 0,
        })),
        clearCart: () => set({ items: [], totalItems: 0 }),
      }),
      {
        name: 'cart-storage', // Nombre de la clave en localStorage
        storage: createJSONStorage(() => localStorage), // Usar localStorage
      }
    )
  )
);
