
import React from 'react';
import { useAppStore } from '@/store';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const Speedometer: React.FC = () => {
    const speed = useAppStore((state) => state.currentSpeedKph);
    const data = [{ name: 'speed', value: speed }];
    const maxSpeed = 160;

    return (
        <div className="bg-slate-900 rounded-xl p-4 h-full flex flex-col items-center justify-center aspect-video shadow-lg border border-slate-800">
            <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        barSize={20}
                        cy="100%"
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, maxSpeed]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: '#1e293b' }}
                            dataKey="value"
                            angleAxisId={0}
                            fill="url(#speedGradient)"
                            cornerRadius={10}
                        />
                         <defs>
                            <linearGradient id="speedGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="70%" stopColor="#22d3ee" />
                                <stop offset="90%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-[10%]">
                    <span className="font-display text-6xl md:text-8xl font-bold text-white tracking-tighter">
                        {Math.round(speed)}
                    </span>
                    <span className="font-sans text-xl text-slate-400 font-semibold">km/h</span>
                </div>
            </div>
        </div>
    );
};

export default Speedometer;
