'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-14 h-14 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="TELUS Logo" 
                className="w-full h-full object-contain"
              />
            </div>
                         <div>
               <h1 className="text-xl font-bold text-gray-800">TELUS</h1>
               <p className="text-xs text-gray-500">Remote Opportunities</p>
             </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#home"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Home
            </motion.a>
            <motion.a
              href="#positions"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Positions
            </motion.a>
            <motion.a
              href="#application-form"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Apply
            </motion.a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
} 