
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import type { RefuelRecord } from '@/types';
import { useAppStore } from '@/store';
import { TrashIcon } from '@heroicons/react/24/outline';

interface HistoryListProps {
    records: RefuelRecord[];
}

const Row: React.FC<{ index: number; style: React.CSSProperties; data: RefuelRecord[] }> = ({ index, style, data }) => {
    const record = data[index];
    const deleteRefuelRecord = useAppStore(state => state.deleteRefuelRecord);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(record.id) {
            deleteRefuelRecord(record.id);
        }
    }

    return (
        <div style={style} className="flex items-center justify-between p-2 border-b border-slate-800">
            <div>
                <p className="font-semibold text-white">{record.litersAdded.toFixed(2)} Liters</p>
                <p className="text-sm text-slate-400">
                    {new Date(record.timestamp).toLocaleString()}
                </p>
            </div>
             <div className="flex items-center space-x-4">
                <p className="text-sm text-slate-300">ODO: {Math.round(record.odometerKm)} km</p>
                <button onClick={handleDelete} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                </button>
             </div>
        </div>
    );
};


const HistoryList: React.FC<HistoryListProps> = ({ records }) => {
    return (
        <List
            height={600} 
            itemCount={records.length}
            itemSize={65}
            width="100%"
            itemData={records}
        >
            {Row}
        </List>
    );
};

export default HistoryList;
