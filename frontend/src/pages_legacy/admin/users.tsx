import { useState, useEffect } from 'react';
import { FaEdit, FaUserShield, FaUser } from 'react-icons/fa';
// Assume 'api' is your configured axios instance
// import api from '@/lib/api';

// Define the structure of a User object
interface User {
    id: number;
    email: string;
    role: 'user' | 'admin';
    subscription: 'Free' | 'Pro' | 'Premium' | 'Expired';
    balance: number;
    agentAccess: {
        'TRADE IDEA COPILOT': boolean;
        'Market Analyst assistant': boolean;
        'Portfolio Builder assistant': boolean;
        'Trendspotter Assistant': boolean;
        'Risk Manager Assistant': boolean;
    };
}

// Mock data for demonstration purposes
const mockUsers: User[] = [
    { id: 1, email: 'john.doe@email.com', role: 'user', subscription: 'Pro', balance: 500.75, agentAccess: { 'TRADE IDEA COPILOT': true, 'Market Analyst assistant': true, 'Portfolio Builder assistant': true, 'Trendspotter Assistant': false, 'Risk Manager Assistant': false } },
    { id: 2, email: 'jane.smith@email.com', role: 'user', subscription: 'Premium', balance: 1250.00, agentAccess: { 'TRADE IDEA COPILOT': true, 'Market Analyst assistant': true, 'Portfolio Builder assistant': true, 'Trendspotter Assistant': true, 'Risk Manager Assistant': true } },
    { id: 3, email: 'admin@mohex.com', role: 'admin', subscription: 'Premium', balance: 0.00, agentAccess: { 'TRADE IDEA COPILOT': true, 'Market Analyst assistant': true, 'Portfolio Builder assistant': true, 'Trendspotter Assistant': true, 'Risk Manager Assistant': true } },
    { id: 4, email: 'new.user@email.com', role: 'user', subscription: 'Free', balance: 0.00, agentAccess: { 'TRADE IDEA COPILOT': true, 'Market Analyst assistant': false, 'Portfolio Builder assistant': false, 'Trendspotter Assistant': false, 'Risk Manager Assistant': false } },
];


const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // In a real app, you would fetch this data from your backend
        // api.get('/admin/users').then(response => setUsers(response.data));
        setUsers(mockUsers);
    }, []);

    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        setMessage('');

        try {
            // This is where you call your backend API to save the changes
            // await api.put(`/admin/users/${selectedUser.id}`, selectedUser);
            
            console.log("Saving user:", selectedUser);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            
            setMessage(`Successfully updated user ${selectedUser.email}.`);
            
            // Update the user list in the state
            setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
            setSelectedUser(null);
        } catch (error) {
            setMessage('Error: Could not update user.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserUpdate = (field: keyof User, value: any) => {
        if (selectedUser) {
            setSelectedUser({ ...selectedUser, [field]: value });
        }
    };
    
    const handleAgentAccessChange = (agentName: string, isEnabled: boolean) => {
        if (selectedUser) {
            const updatedAccess = { ...selectedUser.agentAccess, [agentName]: isEnabled };
            handleUserUpdate('agentAccess', updatedAccess);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            
            {message && <p className="bg-green-600 text-white p-3 rounded mb-4">{message}</p>}

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Subscription</th>
                            <th className="p-4">Balance (USD)</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 flex items-center gap-2">
                                    {user.role === 'admin' ? <FaUserShield className="text-yellow-400" /> : <FaUser className="text-gray-400" />}
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </td>
                                <td className="p-4">{user.subscription}</td>
                                <td className="p-4">${user.balance.toFixed(2)}</td>
                                <td className="p-4">
                                    <button onClick={() => setSelectedUser(user)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                                        <FaEdit /> Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manage User Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Manage User: {selectedUser.email}</h2>
                        
                        {/* Role Management */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Role</label>
                            <select 
                                value={selectedUser.role} 
                                onChange={(e) => handleUserUpdate('role', e.target.value as 'user' | 'admin')}
                                className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Agent Access Management */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Agent Access</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-700 p-4 rounded">
                                {Object.keys(selectedUser.agentAccess).map(agentName => (
                                    <label key={agentName} className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUser.agentAccess[agentName as keyof typeof selectedUser.agentAccess]}
                                            onChange={(e) => handleAgentAccessChange(agentName, e.target.checked)}
                                        />
                                        {agentName}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Balance Adjustment */}
                         <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Adjust Balance</label>
                            <div className="flex items-center gap-2">
                                <span className="p-3 bg-gray-700 rounded-l">Current: ${selectedUser.balance.toFixed(2)}</span>
                                <input
                                    type="number"
                                    placeholder="e.g., 100 or -50"
                                    className="p-3 bg-gray-700 rounded-r text-white border border-gray-600 w-full"
                                    onBlur={(e) => {
                                        const amount = parseFloat(e.target.value);
                                        if (!isNaN(amount)) {
                                            handleUserUpdate('balance', selectedUser.balance + amount);
                                            e.target.value = ''; // Clear input after applying
                                        }
                                    }}
                                />
                            </div>
                         </div>
                        
                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={() => setSelectedUser(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSaveChanges} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500">
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;