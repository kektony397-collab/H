
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-hash-router';
import { HomeIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const RefuelHistoryPage = lazy(() => import('./features/refuelHistory/RefuelHistoryPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-cyan-500"></div>
    </div>
);

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    return (
        <Link to={to}>
            {({ isActive }) => (
                <motion.div
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-300 ${isActive ? 'text-brand-cyan-400' : 'text-slate-400 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {children}
                </motion.div>
            )}
        </Link>
    );
};

function App() {
  return (
    <HashRouter>
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <main className="flex-grow p-4">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/history" element={<RefuelHistoryPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Suspense>
            </main>
            <nav className="sticky bottom-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 p-2">
                <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
                    <NavLink to="/">
                        <HomeIcon className="h-7 w-7" />
                        <span className="text-xs mt-1 font-medium">Dashboard</span>
                    </NavLink>
                    <NavLink to="/history">
                        <ClockIcon className="h-7 w-7" />
                        <span className="text-xs mt-1 font-medium">History</span>
                    </NavLink>
                    <NavLink to="/settings">
                        <Cog6ToothIcon className="h-7 w-7" />
                        <span className="text-xs mt-1 font-medium">Settings</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    </HashRouter>
  );
}

export default App;
