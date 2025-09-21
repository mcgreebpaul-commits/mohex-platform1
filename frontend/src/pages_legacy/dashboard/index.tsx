import Link from 'next/link';
import { FiTrendingUp, FiMessageSquare, FiCreditCard } from 'react-icons/fi';

const DashboardHomePage = () => {
    // Mock data - In a real app, this would come from an API call
    const userData = {
        balance: 10520.75,
        pnl: 520.75,
        activePlan: 'Pro',
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8">Welcome Back, User!</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Simulated Balance</h3>
                    <p className="text-3xl font-bold text-green-400">${userData.balance.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Total P&L</h3>
                    <p className={`text-3xl font-bold ${userData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${userData.pnl.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Subscription Plan</h3>
                    <p className="text-3xl font-bold text-blue-400">{userData.activePlan}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/trading" className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
                    <FiTrendingUp size={40} className="mb-4" />
                    <h3 className="text-xl font-bold">Start Trading</h3>
                    <p className="text-blue-200">Go to the trading interface</p>
                </Link>
                <Link href="/dashboard/chat" className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
                    <FiMessageSquare size={40} className="mb-4" />
                    <h3 className="text-xl font-bold">Chat with AI Agents</h3>
                    <p className="text-purple-200">Get insights and trade ideas</p>
                </Link>
                <Link href="/dashboard/subscription" className="bg-teal-600 hover:bg-teal-700 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
                    <FiCreditCard size={40} className="mb-4" />
                    <h3 className="text-xl font-bold">Manage Subscription</h3>
                    <p className="text-teal-200">View or upgrade your plan</p>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHomePage;