'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Application {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  address: string;
  employmentStatus: string;
  ssn: string;
  idCardFileName: string | null;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filterPosition === '' || app.position === filterPosition;
    
    return matchesSearch && matchesPosition;
  });

  const positions = [...new Set(applications.map(app => app.position))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Job Applications Dashboard
            </h1>
            <p className="text-gray-600">
              Total Applications: {applications.length}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Applications
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Position
              </label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl shadow-lg p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterPosition 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No applications have been submitted yet.'
                }
              </p>
            </motion.div>
          ) : (
            filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {app.firstName} {app.lastName}</p>
                      <p><span className="font-medium">Email:</span> {app.email}</p>
                      <p><span className="font-medium">Phone:</span> {app.phone}</p>
                      <p><span className="font-medium">SSN:</span> {app.ssn}</p>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Job Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Position:</span> {app.position}</p>
                      <p><span className="font-medium">Employment Status:</span> {app.employmentStatus}</p>
                      <p><span className="font-medium">Applied:</span> {new Date(app.timestamp).toLocaleDateString()}</p>
                      <p><span className="font-medium">ID Card:</span> {app.idCardFileName || 'Not uploaded'}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Address
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">{app.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Application ID: {app.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(app.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 