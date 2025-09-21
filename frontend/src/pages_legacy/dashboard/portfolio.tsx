import React from 'react';

const PortfolioPage = () => {
    // Mock data
    const tradeHistory = [
        { id: 1, pair: 'BTC/USDT', type: 'buy', result: 'win', pnl: 250.50, date: '2025-09-17' },
        { id: 2, pair: 'ETH/USDT', type: 'sell', result: 'win', pnl: 400.00, date: '2025-09-16' },
        { id: 3, pair: 'BTC/USDT', type: 'buy', result: 'loss', pnl: -129.75, date: '2025-09-15' },
    ];
    const depositHistory = [
        { id: 1, amount: 10000.00, currency: 'USD', status: 'Approved', date: '2025-09-14' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Portfolio & History</h1>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-10">
                <h2 className="text-2xl font-semibold mb-4">Trade History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3">Pair</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">P&L (USD)</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tradeHistory.map(trade => (
                                <tr key={trade.id} className="border-b border-gray-700">
                                    <td className="p-3">{trade.pair}</td>
                                    <td className={`p-3 font-semibold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{trade.type.toUpperCase()}</td>
                                    <td className={`p-3 font-semibold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trade.pnl.toFixed(2)}</td>
                                    <td className="p-3">{trade.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Deposit History</h2>
                <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3">Amount (USD)</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depositHistory.map(deposit => (
                                <tr key={deposit.id} className="border-b border-gray-700">
                                    <td className="p-3">{deposit.amount.toLocaleString()}</td>
                                    <td className="p-3 text-green-400 font-semibold">{deposit.status}</td>
                                    <td className="p-3">{deposit.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;