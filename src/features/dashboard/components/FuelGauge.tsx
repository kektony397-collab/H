
import React from 'react';
import { useAppStore } from '@/store';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const FuelGauge: React.FC = () => {
    const { currentFuelL, tankCapacityL, fuelEconomyKmPerL, reserveLiters } = useAppStore((state) => ({
        currentFuelL: state.currentFuelL,
        tankCapacityL: state.tankCapacityL,
        fuelEconomyKmPerL: state.fuelEconomyKmPerL,
        reserveLiters: state.reserveLiters,
    }));

    const fuelPercentage = (currentFuelL / tankCapacityL) * 100;
    const estimatedRange = currentFuelL * fuelEconomyKmPerL;
    const isInReserve = currentFuelL <= reserveLiters;

    const data = [{ name: 'fuel', value: fuelPercentage }];

    const barColor = isInReserve ? "#ef4444" : "#22d3ee";

    return (
        <div className="bg-slate-900 rounded-xl p-4 h-full flex flex-col items-center justify-center aspect-square shadow-lg border border-slate-800">
             <span className="font-display text-sm text-slate-400 uppercase tracking-widest">Fuel Level</span>
             <div className="relative w-full h-3/5">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="75%"
                        outerRadius="100%"
                        data={data}
                        startAngle={180}
                        endAngle={-180}
                        barSize={15}
                    >
                         <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                         <RadialBar
                            background={{ fill: '#1e293b' }}
                            dataKey="value"
                            angleAxisId={0}
                            fill={barColor}
                            cornerRadius={10}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-display text-3xl font-bold ${isInReserve ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {Math.round(fuelPercentage)}%
                    </span>
                 </div>
            </div>
            <div className="text-center mt-2">
                <span className="font-sans text-sm text-slate-400">Est. Range</span>
                <p className="font-display text-2xl font-bold text-white">{Math.round(estimatedRange)} km</p>
            </div>
        </div>
    );
};

export default FuelGauge;
