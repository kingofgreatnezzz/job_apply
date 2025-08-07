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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Global Careers</h1>
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
            <motion.a
              href="/only-admin"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin
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