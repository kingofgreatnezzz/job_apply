'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import JobApplicationForm from '../components/JobApplicationForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const positions = [
  'Personalized Internet Assessor - English (US)',
  'Data Entry Specialist - English (US)',
  'Administrative Assistant - English (US)',
  'Financial Secretary - English (US)',
  'AI Training - English (US)',
  'Transcription - English (US)',
  'Translation - English (US)',
  'Data Collection - English (US)'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden pt-16">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Join Our Global Team
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl font-semibold mb-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Work from anywhere, make a difference everywhere
            </motion.h2>
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Available Positions */}
      <section id="positions" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Available Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our diverse range of remote opportunities designed to match your skills and career goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {positions.map((position, index) => (
              <motion.div
                key={position}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{position.split(' - ')[0]}</h3>
                </div>
                <p className="text-gray-600 mb-4">{position.split(' - ')[1]}</p>
                <div className="flex items-center text-sm text-blue-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Remote Position
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Apply Now
            </h2>
            <p className="text-xl text-gray-600">
              Take the first step towards your new career. Complete the form below to get started.
            </p>
          </motion.div>

          <JobApplicationForm positions={positions} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
