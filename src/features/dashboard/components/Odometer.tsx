
import React from 'react';
import { useAppStore } from '@/store';
import Button from '@/components/Button';

interface OdometerProps {
    tripKm: number;
    totalKm: number;
}

const Odometer: React.FC<OdometerProps> = ({ tripKm, totalKm }) => {
    const resetTrip = useAppStore((state) => state.resetTrip);

    return (
        <div className="bg-slate-900 rounded-xl p-4 h-full flex flex-col justify-between aspect-square shadow-lg border border-slate-800">
            <div>
                <span className="font-display text-sm text-slate-400 uppercase tracking-widest">Trip</span>
                <p className="font-display text-4xl font-bold text-white tracking-tighter">
                    {tripKm.toFixed(1)} <span className="text-2xl text-slate-400">km</span>
                </p>
            </div>
            <div className="border-t border-slate-700 pt-2">
                <span className="font-sans text-xs text-slate-400">Total ODO</span>
                <p className="font-display text-lg font-semibold text-slate-300">
                    {Math.round(totalKm).toLocaleString()} km
                </p>
            </div>
            <Button onClick={resetTrip} variant="secondary" size="sm">Reset Trip</Button>
        </div>
    );
};

export default Odometer;
