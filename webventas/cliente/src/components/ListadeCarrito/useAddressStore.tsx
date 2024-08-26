import create from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

interface AddressState {
  country: string | null;
  phone: string;
  contactName: string;
  address: string;
  apartment: string;
  province: string;
  city: string;
  postalCode: string;
  setCountry: (country: string | null) => void;
  setPhone: (phone: string) => void;
  setContactName: (contactName: string) => void;
  setAddress: (address: string) => void;
  setApartment: (apartment: string) => void;
  setProvince: (province: string) => void;
  setCity: (city: string) => void;
  setPostalCode: (postalCode: string) => void;
  setAddressData: (data: string[]) => void;  // Nueva función para establecer todos los valores
  clearAddress: () => void;
}

export const useAddressStore = create<AddressState>()(
  devtools(
    persist(
      (set) => ({
        country: null,
        phone: '',
        contactName: '',
        address: '',
        apartment: '',
        province: '',
        city: '',
        postalCode: '',
        setCountry: (country) => set({ country }),
        setPhone: (phone) => set({ phone }),
        setContactName: (contactName) => set({ contactName }),
        setAddress: (address) => set({ address }),
        setApartment: (apartment) => set({ apartment }),
        setProvince: (province) => set({ province }),
        setCity: (city) => set({ city }),
        setPostalCode: (postalCode) => set({ postalCode }),
        setAddressData: (data: string[]) => set({
          contactName: data[0],
          phone: data[1],
          apartment: data[2],
          address: data[3],
          province: data[4],
          city: data[5],
          postalCode: data[6],
          country: data[7],
        }), // Asigna todos los valores a partir de un array
        clearAddress: () => set({
          country: '',
          phone: '',
          contactName: '',
          address: '',
          apartment: '',
          province: '',
          city: '',
          postalCode: ''
        }),
      }),
      {
        name: 'address-storage', // Nombre de la clave en localStorage
        storage: createJSONStorage(() => localStorage), // Usar localStorage
      }
    )
  )
);
