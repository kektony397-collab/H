
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAppStore } from '@/store';
import Button from '@/components/Button';

interface AddRefuelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddRefuelModal: React.FC<AddRefuelModalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { addRefuelRecord, totalOdometerKm, addFuel } = useAppStore((state) => ({
        addRefuelRecord: state.addRefuelRecord,
        totalOdometerKm: state.totalOdometerKm,
        addFuel: state.addFuel,
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/parse-refuel-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: input }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to parse entry.');
            }

            const data = await response.json();
            const litersAdded = data.litersAdded;

            if (typeof litersAdded !== 'number' || litersAdded <= 0) {
                throw new Error('Invalid amount returned from AI.');
            }

            await addRefuelRecord({
                timestamp: Date.now(),
                litersAdded,
                odometerKm: totalOdometerKm,
            });
            
            addFuel(litersAdded);
            setInput('');
            onClose();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                 <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 p-6 text-left align-middle shadow-xl transition-all border border-slate-800">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white font-display">
                                    Add Refuel Entry
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Enter the amount in natural language. e.g., "5.5 liters" or "filled up the tank".
                                    </p>
                                    <div>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="e.g. put 6 litres in"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-cyan-500 focus:border-brand-cyan-500 outline-none"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <div className="mt-6 flex justify-end space-x-2">
                                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" isLoading={isLoading}>
                                            {isLoading ? 'Parsing...' : 'Add'}
                                        </Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddRefuelModal;
