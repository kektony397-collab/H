
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

export function useFuelCalculator() {
    const { tripKm, fuelEconomyKmPerL, consumeFuel } = useAppStore((state) => ({
        tripKm: state.tripKm,
        fuelEconomyKmPerL: state.fuelEconomyKmPerL,
        consumeFuel: state.consumeFuel,
    }));
    
    const lastTripKmRef = useRef(tripKm);

    useEffect(() => {
        const distanceDelta = tripKm - lastTripKmRef.current;

        if (distanceDelta > 0) {
            const fuelConsumed = distanceDelta / fuelEconomyKmPerL;
            consumeFuel(fuelConsumed);
            lastTripKmRef.current = tripKm;
        }
    }, [tripKm, fuelEconomyKmPerL, consumeFuel]);
}
