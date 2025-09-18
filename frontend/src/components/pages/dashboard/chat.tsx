import { useState } from 'react';
// This assumes you have a ChatInterface component, for example in
// `frontend/src/components/dashboard/ChatInterface.tsx`

const AIChatPage = () => {
    // This data would normally come from the user's subscription plan via an API call
    const availableAgents = [
        { name: "TRADE IDEA COPILOT", webhook: "https://eoj65e7xlqgvuuo.m.pipedream.net" },
        { name: "Market Analyst assistant", webhook: "https://eozbl198ek1uo44.m.pipedream.net" },
        { name: "Portfolio Builder assistant", webhook: "https://eozbl198ek1uo44.m.pipedream.net" },
        { name: "Trendspotter Assistant", webhook: "https://eouue2p5djiewtr.m.pipedream.net" },
        { name: "Risk Manager Assistant", webhook: "https://eoxx3em8sfjeut3.m.pipedream.net" }
    ];

    const [activeAgent, setActiveAgent] = useState(availableAgents[0]);

    // Placeholder for the actual chat component, which would handle the API calls and speech API
    const ChatInterface = ({ agent }: { agent: { name: string, webhook: string } }) => (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">Chat with {agent.name}</h2>
            <div className="flex-grow text-gray-400 text-center flex items-center justify-center">
                <p>Chat interface for {agent.name} would be here.<br/>It would call the webhook: {agent.webhook}</p>
            </div>
            <div className="mt-4 flex">
                <input type="text" placeholder="Type your message or use voice command..." className="flex-grow p-3 bg-gray-700 rounded-l-lg border border-gray-600 focus:outline-none"/>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-r-lg">Send</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col md:flex-row gap-4">
            {/* Agent Selection Sidebar */}
            <aside className="md:w-1/4 lg:w-1/5 bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">AI Agents</h2>
                <ul>
                    {availableAgents.map(agent => (
                        <li key={agent.name} 
                            onClick={() => setActiveAgent(agent)}
                            className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${activeAgent.name === agent.name ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            {agent.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-grow h-[calc(100vh-2rem)]">
                <ChatInterface agent={activeAgent} />
            </main>
        </div>
    );
};

export default AIChatPage;