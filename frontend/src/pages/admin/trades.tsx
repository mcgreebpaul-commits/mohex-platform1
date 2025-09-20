// --- frontend/src/pages/admin/trades.tsx ---
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
// You should create an AdminLayout component for navigation
// import AdminLayout from '@/components/admin/AdminLayout';

interface Trade {
    id: number;
    user_email: string;
    pair: string;
    signal: 'buy' | 'sell';
    amount: number;
    status: string;
}

interface SimulationState {
    tradeId: number | null;
    outcome: 'win' | 'loss' | null;
}

const AdminTradesPage = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [simulation, setSimulation] = useState<SimulationState>({ tradeId: null, outcome: null });
    const [percentage, setPercentage] = useState('5'); // Default 5%
    const [duration, setDuration] = useState('24'); // Default 24 hours

    const fetchPendingTrades = async () => {
        try {
            // This assumes your auth token is stored and sent with requests
            // You'll need an axios interceptor or helper to attach the token
            const { data } = await axios.get('/api/admin/trades/pending');
            setTrades(data);
        } catch (err) {
            setError('Failed to fetch trades. Are you logged in?');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPendingTrades();
    }, []);

    const handleSimulateClick = (tradeId: number, outcome: 'win' | 'loss') => {
        setSimulation({ tradeId, outcome });
    };

    const handleSimulationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!simulation.tradeId || !simulation.outcome) return;

        try {
            await axios.post('/api/admin/trades/simulate', {
                tradeId: simulation.tradeId,
                outcome: simulation.outcome,
                profitLossPercentage: parseFloat(percentage),
                duration: parseInt(duration),
            });
            // Refresh trades list after simulation
            fetchPendingTrades();
            // Reset simulation form
            setSimulation({ tradeId: null, outcome: null });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Simulation failed');
        }
    };
    
    if (loading) return <div className="text-white p-8">Loading trades...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        // <AdminLayout>
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Pending Trades Simulation</h1>
            
            <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Pair</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Signal</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Amount (USD)</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade) => (
                            <tr key={trade.id}>
                                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">{trade.user_email}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">{trade.pair}</td>
                                <td className={`px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm font-semibold ${trade.signal === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.signal.toUpperCase()}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">${trade.amount.toFixed(2)}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                                    <button onClick={() => handleSimulateClick(trade.id, 'win')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">Win</button>
                                    <button onClick={() => handleSimulateClick(trade.id, 'loss')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Loss</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {simulation.tradeId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">
                            Simulate Outcome for Trade #{simulation.tradeId} ({simulation.outcome?.toUpperCase()})
                        </h2>
                        <form onSubmit={handleSimulationSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Profit/Loss Percentage (%)</label>
                                <input 
                                    type="number" 
                                    value={percentage} 
                                    onChange={e => setPercentage(e.target.value)}
                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Trade Duration (hours)</label>
                                <input 
                                    type="number" 
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setSimulation({ tradeId: null, outcome: null })} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                <button type="submit" className={`font-bold py-2 px-4 rounded ${simulation.outcome === 'win' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm {simulation.outcome}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        // </AdminLayout>
    );
};

export default AdminTradesPage;