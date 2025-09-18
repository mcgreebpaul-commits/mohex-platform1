import Link from 'next/link';
// We'll need a way to protect this page. You can use a Higher-Order Component (HOC)
// or a check in a layout component. For simplicity, we'll assume a hook `useAdminAuth`.

const AdminDashboard = () => {
    // A real implementation would have a hook here to protect the route
    // const { loading, isAdmin } = useAdminAuth();
    // if (loading || !isAdmin) return <div>Loading...</div>;

    const managementLinks = [
        { href: '/admin/users', title: 'User Management', description: 'View, edit, and manage user accounts.' },
        { href: '/admin/payments', title: 'Payment Verification', description: 'Approve or reject pending deposits and subscriptions.' },
        { href: '/admin/trades', title: 'Trade Simulation', description: 'Manage pending trades and decide outcomes.' },
        { href: '/admin/plans', title: 'Subscription Plans', description: 'Create and edit subscription tiers.' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="mb-10 flex justify-between items-center">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <button 
                    onClick={() => { /* Add logout logic here */ }} 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </header>
            
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {managementLinks.map(link => (
                    <Link href={link.href} key={link.href} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:scale-105 transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-2 text-blue-400">{link.title}</h2>
                        <p className="text-gray-400">{link.description}</p>
                    </Link>
                ))}
            </main>

            <div className="mt-12 bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-4xl font-bold text-green-400">150</p>
                        <p className="text-gray-400">Total Users</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-yellow-400">12</p>
                        <p className="text-gray-400">Pending Payments</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-cyan-400">34</p>
                        <p className="text-gray-400">Pending Trades</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-purple-400">$5,400</p>
                        <p className="text-gray-400">Total Deposits Today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;