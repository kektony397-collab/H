
import { db } from '@/services/db';
import type { StateStorage } from 'zustand/middleware';
import type { Settings } from '@/types';

const parseSettings = (records: Settings[]): Record<string, unknown> => {
    return records.reduce((acc, record) => {
        acc[record.key] = record.value;
        return acc;
    }, {} as Record<string, unknown>);
};

export const dexieStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (name === 'settings-storage') {
            const settingsArray = await db.settings.toArray();
            return JSON.stringify({
                state: parseSettings(settingsArray),
                version: 0,
            });
        }
        if (name === 'history-storage') {
             const refuelRecords = await db.refuelRecords.toArray();
             const tripLogs = await db.tripLogs.toArray();
             return JSON.stringify({
                state: { refuelRecords, tripLogs },
                version: 0,
            });
        }
        return null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        const { state } = JSON.parse(value);
        if (name === 'settings-storage') {
            await db.transaction('rw', db.settings, async () => {
                for (const key in state) {
                    await db.settings.put({ key, value: state[key] }, key);
                }
            });
        }
         if (name === 'history-storage') {
            await db.transaction('rw', db.refuelRecords, db.tripLogs, async () => {
                if (state.refuelRecords) {
                    await db.refuelRecords.clear();
                    await db.refuelRecords.bulkAdd(state.refuelRecords);
                }
                if (state.tripLogs) {
                    await db.tripLogs.clear();
                    await db.tripLogs.bulkAdd(state.tripLogs);
                }
            });
        }
    },
    removeItem: async (name: string): Promise<void> => {
        if (name === 'settings-storage') {
            await db.settings.clear();
        }
        if (name === 'history-storage') {
            await db.refuelRecords.clear();
            await db.tripLogs.clear();
        }
    },
};
