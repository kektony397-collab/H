
import React from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFuelCalculator } from './hooks/useFuelCalculator';
import Speedometer from './components/Speedometer';
import FuelGauge from './components/FuelGauge';
import Odometer from './components/Odometer';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { WifiIcon, NoSymbolIcon } from '@heroicons/react/24/solid';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const DashboardPage: React.FC = () => {
    useGeolocation();
    useFuelCalculator();

    const { isGpsAvailable, tripKm, totalOdometerKm } = useAppStore((state) => ({
        isGpsAvailable: state.isGpsAvailable,
        tripKm: state.tripKm,
        totalOdometerKm: state.totalOdometerKm,
    }));

    return (
        <div className="flex flex-col h-full space-y-4">
            <header className="flex justify-between items-center p-2 rounded-lg bg-slate-900/50">
                <h1 className="text-2xl font-display text-brand-cyan-400">SMART DASH</h1>
                <div className="flex items-center space-x-2 text-xs font-semibold">
                    <span>GPS</span>
                     {isGpsAvailable ? 
                        <WifiIcon className="h-5 w-5 text-green-400 animate-pulse-glow" /> :
                        <NoSymbolIcon className="h-5 w-5 text-red-500" />
                     }
                </div>
            </header>
            <motion.div 
                className="grid grid-cols-2 gap-4 flex-grow"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="col-span-2" variants={itemVariants}>
                    <Speedometer />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <FuelGauge />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Odometer tripKm={tripKm} totalKm={totalOdometerKm} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
