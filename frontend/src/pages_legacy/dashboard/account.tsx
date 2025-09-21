import React from 'react';

const AccountPage = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API call to change password
        alert('Password change request submitted.');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

            <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="mb-6">
                    <h3 className="text-gray-400">Email</h3>
                    <p className="text-lg">user@example.com</p>
                </div>
                <hr className="border-gray-700 my-6" />
                <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Current Password</label>
                        <input type="password" required className="w-full p-3 bg-gray-700 rounded border border-gray-600"/>
                    </div>
                     <div className="mb-4">
                        <label className="block mb-2">New Password</label>
                        <input type="password" required className="w-full p-3 bg-gray-700 rounded border border-gray-600"/>
                    </div>
                     <div className="mb-6">
                        <label className="block mb-2">Confirm New Password</label>
                        <input type="password" required className="w-full p-3 bg-gray-700 rounded border border-gray-600"/>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;