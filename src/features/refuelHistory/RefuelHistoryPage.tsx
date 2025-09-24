
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/services/db';
import HistoryList from './components/HistoryList';
import AddRefuelModal from './components/AddRefuelModal';
import Button from '@/components/Button';
import type { RefuelRecord } from '@/types';

const RefuelHistoryPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const refuelRecords = useLiveQuery(
        () => db.refuelRecords.orderBy('timestamp').reverse().toArray(), []
    ) as RefuelRecord[] | undefined;
    
    return (
        <div className="flex flex-col h-full">
            <header className="flex justify-between items-center mb-4">
                 <h1 className="text-2xl font-display text-brand-cyan-400">Refuel History</h1>
                 <Button onClick={() => setIsModalOpen(true)}>Add Entry</Button>
            </header>
            
            <div className="flex-grow bg-slate-900 rounded-lg p-2 border border-slate-800">
                {refuelRecords && refuelRecords.length > 0 ? (
                    <HistoryList records={refuelRecords} />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>No refuel records yet.</p>
                    </div>
                )}
            </div>

            <AddRefuelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default RefuelHistoryPage;
