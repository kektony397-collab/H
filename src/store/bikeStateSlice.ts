
import type { StateCreator } from 'zustand';
import type { AppState } from './index';

export interface BikeStateSlice {
  currentFuelL: number;
  tripKm: number;
  totalOdometerKm: number;
  currentSpeedKph: number;
  isGpsAvailable: boolean;
  isNetworkAvailable: boolean;
  updatePosition: (speedKph: number, distanceDeltaKm: number) => void;
  consumeFuel: (liters: number) => void;
  setGpsStatus: (isAvailable: boolean) => void;
  addFuel: (liters: number) => void;
  resetTrip: () => void;
}

export const createBikeStateSlice: StateCreator<
  AppState,
  [],
  [],
  BikeStateSlice
> = (set, get) => ({
  currentFuelL: 5,
  tripKm: 0,
  totalOdometerKm: 12000,
  currentSpeedKph: 0,
  isGpsAvailable: false,
  isNetworkAvailable: navigator.onLine,
  updatePosition: (speedKph, distanceDeltaKm) => {
    set((state) => ({
      currentSpeedKph: speedKph,
      tripKm: state.tripKm + distanceDeltaKm,
      totalOdometerKm: state.totalOdometerKm + distanceDeltaKm,
    }));
  },
  consumeFuel: (liters) => {
    set((state) => ({
      currentFuelL: Math.max(0, state.currentFuelL - liters),
    }));
  },
  setGpsStatus: (isAvailable) => {
    set({ isGpsAvailable: isAvailable });
  },
  addFuel: (liters) => {
    const { tankCapacityL } = get();
    set((state) => ({
      currentFuelL: Math.min(tankCapacityL, state.currentFuelL + liters)
    }))
  },
  resetTrip: () => {
    set({ tripKm: 0 });
  }
});
