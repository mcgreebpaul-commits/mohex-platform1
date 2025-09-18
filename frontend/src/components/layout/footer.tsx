// frontend/src/components/layout/Footer.tsx

import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Mohex</h3>
            <p className="text-sm leading-relaxed max-w-md">
              Mohex is an Australian AI startup building advanced AI agents that integrate with the recent AP2 platform. We empower users with AI-driven trade ideas, portfolio building, and risk management to navigate the crypto markets.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><FaLinkedin size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><FaGithub size={24} /></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="/dashboard/trading" className="hover:text-cyan-400 transition-colors">Dashboard</a></li>
              <li><a href="/about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="/subscription" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Address & Map Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <p className="text-sm mb-4">124 McLeans Road, THREE MOON, 4630 Australia</p>
            <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-gray-700">
               <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=124+McLeans+Road,THREE+MOON,4630+Australia">
              </iframe>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mohex. All rights reserved.</p>
          <p className="mt-2 text-xs">Disclaimer: a science work.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;