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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden pt-16">
        {/* Background with TELUS branding */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
          {/* Abstract background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-pink-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-green-400 rounded-full blur-xl"></div>
          </div>
          
          {/* TELUS Digital Welcome Section */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div
              className="text-white/80 text-lg font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome to
            </motion.div>
                         <motion.div
               className="flex items-center justify-center space-x-2 mt-2"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5, duration: 0.8 }}
             >
               <div className="w-12 h-12 flex items-center justify-center">
                 <img 
                   src="/logo.png" 
                   alt="TELUS Logo" 
                   className="w-full h-full object-contain"
                 />
               </div>
               <span className="text-white text-2xl font-bold">TELUS</span>
               <span className="text-white text-xl font-medium">Digital</span>
             </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-6xl mx-auto">
            {/* Stars decoration */}
            <motion.div
              className="flex justify-center space-x-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="w-4 h-4 bg-yellow-400 transform rotate-45"></div>
              <div className="w-6 h-6 bg-yellow-400 transform rotate-45"></div>
              <div className="w-4 h-4 bg-yellow-400 transform rotate-45"></div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Over 10 Million Job Seekers Have Used TELUS to Find a Better Way to Work
            </motion.h1>
            
            <motion.div
              className="w-32 h-1 bg-orange-500 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.8, duration: 1 }}
            ></motion.div>

            <motion.h2
              className="text-2xl md:text-3xl font-semibold mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Ready to be part of something bigger?
            </motion.h2>

            <motion.button
              className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Apply Now
            </motion.button>

            {/* Media mentions */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="text-white/70 text-sm mb-4">As seen on</p>
              <div className="flex justify-center items-center space-x-6 text-white/60 text-sm">
                <span className="font-bold">CNN</span>
                <span className="font-bold">WSJ</span>
                <span className="font-bold">USA TODAY</span>
                <span className="font-bold">CNBC</span>
                <span className="font-bold">FOX BUSINESS</span>
                <span className="font-bold">GMA</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Join Our Collaborative Team
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Work with talented professionals in a dynamic, innovative environment where your ideas matter and collaboration drives success.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Innovative problem-solving approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Dynamic team collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Professional growth opportunities</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Collaboration</h3>
                  <p className="text-gray-600 text-sm">Brainstorming innovative solutions together</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs">Team Members</div>
              </div>
            </motion.div>
          </div>
        </div>
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

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Millions
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join the millions of professionals who have found their dream careers through TELUS
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-4">10M+</div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Seekers</h3>
              <p className="text-blue-100">Have used TELUS to find better opportunities</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-green-400 mb-4">50K+</div>
              <h3 className="text-xl font-semibold text-white mb-2">Remote Positions</h3>
              <p className="text-blue-100">Available across various industries</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-pink-400 mb-4">98%</div>
              <h3 className="text-xl font-semibold text-white mb-2">Success Rate</h3>
              <p className="text-blue-100">Of applicants find suitable positions</p>
            </motion.div>
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
