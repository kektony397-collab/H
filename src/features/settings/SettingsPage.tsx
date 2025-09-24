
import React from 'react';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
};


const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string, unit?: string }> = 
({ label, value, onChange, type = 'text', unit }) => (
    <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
        <div className="relative">
             <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-cyan-500 focus:border-brand-cyan-500 outline-none pr-16"
            />
            {unit && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">{unit}</span>}
        </div>
    </motion.div>
);

const SettingsPage: React.FC = () => {
    const {
        bikeModel, setBikeModel,
        tankCapacityL, setTankCapacity,
        fuelEconomyKmPerL, setFuelEconomy,
        reserveLiters, setReserveLiters
    } = useAppStore();

    return (
        <div className="p-2">
            <h1 className="text-2xl font-display text-brand-cyan-400 mb-6">Settings</h1>
            <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <InputField 
                    label="Bike Model"
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                />
                 <InputField 
                    label="Tank Capacity"
                    value={tankCapacityL}
                    onChange={(e) => setTankCapacity(Number(e.target.value))}
                    type="number"
                    unit="Liters"
                />
                 <InputField 
                    label="Average Fuel Economy"
                    value={fuelEconomyKmPerL}
                    onChange={(e) => setFuelEconomy(Number(e.target.value))}
                    type="number"
                    unit="km/L"
                />
                <InputField 
                    label="Reserve Fuel Level"
                    value={reserveLiters}
                    onChange={(e) => setReserveLiters(Number(e.target.value))}
                    type="number"
                    unit="Liters"
                />
            </motion.div>
        </div>
    );
};

export default SettingsPage;
