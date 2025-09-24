
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { dexieStorage } from './dexieStorage';
import type { AppState } from './index';
import type { RefuelRecord, TripLog } from '@/types';
import { db } from '@/services/db';

export interface HistorySlice {
  refuelRecords: RefuelRecord[];
  tripLogs: TripLog[];
  addRefuelRecord: (record: Omit<RefuelRecord, 'id'>) => Promise<void>;
  deleteRefuelRecord: (id: number) => Promise<void>;
  addTripLog: (log: Omit<TripLog, 'id'>) => Promise<void>;
}

export const createHistorySlice: StateCreator<
  AppState,
  [],
  [['zustand/persist', unknown]],
  HistorySlice
> = (set) => persist(
  (set) => ({
    refuelRecords: [],
    tripLogs: [],
    addRefuelRecord: async (record) => {
      const id = await db.refuelRecords.add(record as RefuelRecord);
      set((state) => ({
        refuelRecords: [...state.refuelRecords, { ...record, id }].sort((a, b) => b.timestamp - a.timestamp),
      }));
    },
    deleteRefuelRecord: async (id) => {
        await db.refuelRecords.delete(id);
        set((state) => ({
            refuelRecords: state.refuelRecords.filter((r) => r.id !== id),
        }));
    },
    addTripLog: async (log) => {
      const id = await db.tripLogs.add(log as TripLog);
      set((state) => ({
        tripLogs: [...state.tripLogs, { ...log, id }].sort((a,b) => b.startTimestamp - a.startTimestamp),
      }));
    },
  }),
  {
    name: 'history-storage',
    storage: dexieStorage,
    // Initialize from DB on load
    onRehydrateStorage: () => async (state) => {
      if (state) {
        const refuelRecords = await db.refuelRecords.orderBy('timestamp').reverse().toArray();
        const tripLogs = await db.tripLogs.orderBy('startTimestamp').reverse().toArray();
        state.refuelRecords = refuelRecords;
        state.tripLogs = tripLogs;
      }
    }
  }
);
