import React from 'react';

const SubscriptionPage = () => {
    // Mock data
    const currentPlan = {
        name: 'Pro',
        expires: 'October 18, 2025',
    };

    const plans = [
        { name: 'Free', price: '$0', agents: 1, features: ['Trade Idea Copilot', 'Basic Support'] },
        { name: 'Pro', price: '$20', agents: 3, features: ['All Free features', 'Market & Portfolio Agents', 'Priority Support'] },
        { name: 'Premium', price: '$50', agents: 5, features: ['All Pro features', 'Trendspotter & Risk Agents', '24/7 Dedicated Support'] },
    ];

    const handleSubscribe = (planName: string) => {
        // Logic to initiate the crypto payment process
        alert(`Initiating subscription process for the ${planName} plan.`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Subscriptions</h1>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-10">
                <h2 className="text-2xl font-semibold">Your Current Plan</h2>
                <p className="text-xl text-blue-400 mt-2">{currentPlan.name}</p>
                <p className="text-gray-400">Your plan renews on {currentPlan.expires}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.name} className={`bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col border-2 ${plan.name === currentPlan.name ? 'border-blue-500' : 'border-gray-700'}`}>
                        <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                        <p className="text-4xl font-extrabold text-center my-4">{plan.price}<span className="text-lg text-gray-400">/month</span></p>
                        <p className="text-center text-gray-400 mb-6">Access to {plan.agents} AI Agent(s)</p>
                        <ul className="space-y-2 mb-8 flex-grow">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleSubscribe(plan.name)}
                            disabled={plan.name === currentPlan.name}
                            className="w-full mt-auto bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {plan.name === currentPlan.name ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;