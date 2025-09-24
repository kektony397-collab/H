import Dexie, { type Table } from 'dexie';
import type { Settings, RefuelRecord, TripLog } from '@/types';

export class AppDB extends Dexie {
  settings!: Table<Settings>;
  refuelRecords!: Table<RefuelRecord>;
  tripLogs!: Table<TripLog>;

  constructor() {
    super('SmartBikeDashboardDB');
  }
}

export const db = new AppDB();

// FIX: Moved versioning out of the constructor to resolve a TypeScript type
// inference issue where `this.version` was not found on the class instance
// within the constructor's scope.
db.version(1).stores({
  settings: '++id, &key',
  refuelRecords: '++id, timestamp',
  tripLogs: '++id, startTimestamp',
});
