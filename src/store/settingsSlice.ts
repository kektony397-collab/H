
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { dexieStorage } from './dexieStorage';
import type { AppState } from './index';

export interface SettingsSlice {
  bikeModel: string;
  tankCapacityL: number;
  fuelEconomyKmPerL: number;
  reserveLiters: number;
  setBikeModel: (model: string) => void;
  setTankCapacity: (capacity: number) => void;
  setFuelEconomy: (economy: number) => void;
  setReserveLiters: (liters: number) => void;
}

export const createSettingsSlice: StateCreator<
  AppState,
  [],
  [['zustand/persist', unknown]],
  SettingsSlice
> = (set) => persist(
  (set) => ({
    bikeModel: 'Honda Dream Yuga',
    tankCapacityL: 8,
    fuelEconomyKmPerL: 55,
    reserveLiters: 1.5,
    setBikeModel: (model) => set({ bikeModel: model }),
    setTankCapacity: (capacity) => set({ tankCapacityL: capacity }),
    setFuelEconomy: (economy) => set({ fuelEconomyKmPerL: economy }),
    setReserveLiters: (liters) => set({ reserveLiters: liters }),
  }),
  {
    name: 'settings-storage',
    storage: dexieStorage,
  }
);
