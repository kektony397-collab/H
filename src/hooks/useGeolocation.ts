
import { useState, useEffect, useRef } from 'react';
import KalmanFilter from 'kalman-filter';
import { haversineDistance } from '@/lib/utils';
import { useAppStore } from '@/store';

interface Position {
    lat: number;
    lon: number;
    speedKph: number;
    timestamp: number;
}

export function useGeolocation() {
    const [error, setError] = useState<string | null>(null);
    const setGpsStatus = useAppStore((state) => state.setGpsStatus);
    const updatePosition = useAppStore((state) => state.updatePosition);
    
    const lastPositionRef = useRef<Position | null>(null);
    const kalmanFilterRef = useRef<KalmanFilter | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setGpsStatus(false);
            return;
        }

        const kf = new KalmanFilter({
            observation: 2, 
            dynamic: 'constant-velocity',
        });
        kalmanFilterRef.current = kf;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude, speed } = pos.coords;
                const currentTimestamp = pos.timestamp;
                
                setGpsStatus(true);
                setError(null);
                
                const currentSpeedKph = speed ? speed * 3.6 : 0;
                
                const observation = [latitude, longitude];
                const predicted = kalmanFilterRef.current?.predict();
                const corrected = kalmanFilterRef.current?.correct({
                    predicted,
                    observation,
                });

                if (!corrected) return;

                const [smoothedLat, smoothedLon] = corrected.mean.flat();
                
                const currentPosition: Position = {
                    lat: smoothedLat,
                    lon: smoothedLon,
                    speedKph: currentSpeedKph,
                    timestamp: currentTimestamp,
                };
                
                if (lastPositionRef.current) {
                    const distanceDeltaKm = haversineDistance(
                        lastPositionRef.current.lat,
                        lastPositionRef.current.lon,
                        currentPosition.lat,
                        currentPosition.lon
                    );
                    
                    // Only update if there's significant movement
                    if (distanceDeltaKm > 0.001) { // > 1 meter
                        updatePosition(currentSpeedKph, distanceDeltaKm);
                    } else {
                        updatePosition(0, 0); // Stationary
                    }
                } else {
                    updatePosition(currentSpeedKph, 0);
                }
                
                lastPositionRef.current = currentPosition;
            },
            (err) => {
                setError(err.message);
                setGpsStatus(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setGpsStatus, updatePosition]);

    return { error };
}
