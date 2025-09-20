// --- frontend/src/pages/index.tsx ---
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

const HomePage = () => {
    // You'll need to add these images to your `public` folder
    const featureImages = [
        { src: "/images/dark-chart-view.jpg", title: "Trade Ideas with Copilot", description: "Get real-time suggestions and market analysis from our most advanced AI agent." },
        { src: "/images/portfolio-table.jpg", title: "Build Your Portfolio", description: "Let our AI portfolio builder create a diversified, risk-assessed portfolio for you." },
        { src: "/images/candlestick-chart.jpg", title: "Spot Trends Instantly", description: "Our Trendspotter Assistant analyzes candlestick patterns and market data to find opportunities." },
        { src: "/images/multi-indicator-chart.jpg", title: "Advanced Risk Management", description: "Utilize sophisticated tools and AI analysis to manage and mitigate your trading risks effectively." },
    ];

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <main 
                className="relative text-center py-40 px-4" 
                style={{ backgroundImage: "url('/images/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Welcome to Mohex</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">Advanced AI Trading Agents at Your Fingertips</p>
                    <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
                        Get Started
                    </a>
                </div>
            </main>
            
            {/* Company Description Section */}
            <section className="py-20 px-6 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Who We Are</h2>
                    <p className="text-lg text-gray-300">
                        Mohex is an Australian AI startup that's building advanced AI agents that integrate with the recent AP2 platform. This gives our AI agents the ability to carry out transactions for users with upgraded context understanding. This is an AI agents crypto trading platform where you can gain access to advanced systems that help give trade ideas, build financial portfolios, and create risk overviews. Users have the benefit of choosing any AI agent to trade for them.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-gray-800">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Trading Capabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {featureImages.map((feature, index) => (
                            <div key={index} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-full h-64">
                                    <Image src={feature.src} alt={feature.title} layout="fill" objectFit="cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;