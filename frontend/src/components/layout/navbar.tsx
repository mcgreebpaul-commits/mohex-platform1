// frontend/src/components/layout/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-md text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <Image 
              src="/logo.png" // Make sure your logo is in frontend/public/logo.png
              alt="Mohex Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="ml-3 text-2xl font-bold text-cyan-400">Mohex</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-cyan-400 transition-colors duration-300">Home</Link>
          <Link href="/dashboard/trading" className="hover:text-cyan-400 transition-colors duration-300">Dashboard</Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors duration-300">About Us</Link>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors duration-300">Contact</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" passHref>
            <button className="py-2 px-4 border border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300">
              Login
            </button>
          </Link>
          <Link href="/signup" passHref>
             <button className="py-2 px-4 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-600 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;