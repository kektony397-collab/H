
export interface BikeState {
    currentFuelL: number;
    tripKm: number;
    totalOdometerKm: number;
    currentSpeedKph: number;
    isGpsAvailable: boolean;
    isNetworkAvailable: boolean;
}

export interface Settings {
    id?: number;
    key: string;
    value: string | number;
}

export interface RefuelRecord {
    id?: number;
    timestamp: number;
    litersAdded: number;
    odometerKm: number;
}

export interface TripLog {
    id?: number;
    startTimestamp: number;
    endTimestamp: number;
    distanceKm: number;
    averageSpeedKph: number;
}
