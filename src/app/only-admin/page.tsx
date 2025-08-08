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
  idCardFrontFileName: string | null;
  idCardBackFileName: string | null;
}



export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

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
    } catch (err) {
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by newest first
    .filter(app => {
      const matchesSearch = 
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPosition = filterPosition === '' || app.position === filterPosition;
      
      return matchesSearch && matchesPosition;
    });

  const positions = [...new Set(applications.map(app => app.position))];

  const handleViewImage = (fileName: string) => {
    if (fileName) {
      // Encode the file name for URL safety
      const encodedFileName = encodeURIComponent(fileName);
      const imageUrl = `/api/uploads/${encodedFileName}`;
      console.log('Attempting to view image:', imageUrl);
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  const handleDownloadImage = async (fileName: string) => {
    if (fileName) {
      try {
        // Encode the file name for URL safety
        const encodedFileName = encodeURIComponent(fileName);
        const downloadUrl = `/api/uploads/${encodedFileName}`;
        console.log('Attempting to download image:', downloadUrl);
        
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error('Error downloading file:', err);
        alert('Error downloading file. Please try again.');
      }
    }
  };

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
            <div className="flex items-center justify-center space-x-3 mb-4">
                              <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="TELUS Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  TELUS Job Applications Dashboard
                </h1>
                <p className="text-gray-600">
                  Total Applications: {applications.length}
                </p>
              </div>
            </div>
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
                     <div className="space-y-2 text-sm text-gray-700">
                       <p><span className="font-medium text-gray-800">Name:</span> {app.firstName} {app.lastName}</p>
                       <p><span className="font-medium text-gray-800">Email:</span> {app.email}</p>
                       <p><span className="font-medium text-gray-800">Phone:</span> {app.phone}</p>
                       <p><span className="font-medium text-gray-800">SSN:</span> {app.ssn}</p>
                     </div>
                   </div>

                  {/* Job Info */}
                                     <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">
                       Job Information
                     </h3>
                     <div className="space-y-2 text-sm text-gray-700">
                       <p><span className="font-medium text-gray-800">Position:</span> {app.position}</p>
                       <p><span className="font-medium text-gray-800">Employment Status:</span> {app.employmentStatus}</p>
                       <p><span className="font-medium text-gray-800">Applied:</span> {new Date(app.timestamp).toLocaleDateString()}</p>
                       <p><span className="font-medium text-gray-800">ID Cards:</span></p>
                       <div className="space-y-2 mt-2">
                         {/* Front ID Card */}
                         <div>
                           <span className="text-sm font-medium text-gray-700">Front:</span>
                           {app.idCardFrontFileName ? (
                             <div className="flex items-center space-x-2 mt-1">
                               <span className="text-blue-600 text-sm">{app.idCardFrontFileName}</span>
                               <button
                                 onClick={() => handleViewImage(app.idCardFrontFileName!)}
                                 className="text-blue-600 hover:text-blue-800 text-xs underline"
                               >
                                 View
                               </button>
                               <button
                                 onClick={() => handleDownloadImage(app.idCardFrontFileName!)}
                                 className="text-green-600 hover:text-green-800 text-xs underline"
                               >
                                 Download
                               </button>
                             </div>
                           ) : (
                             <span className="text-sm text-gray-500">Not uploaded</span>
                           )}
                         </div>
                         
                         {/* Back ID Card */}
                         <div>
                           <span className="text-sm font-medium text-gray-700">Back:</span>
                           {app.idCardBackFileName ? (
                             <div className="flex items-center space-x-2 mt-1">
                               <span className="text-blue-600 text-sm">{app.idCardBackFileName}</span>
                               <button
                                 onClick={() => handleViewImage(app.idCardBackFileName!)}
                                 className="text-blue-600 hover:text-blue-800 text-xs underline"
                               >
                                 View
                               </button>
                               <button
                                 onClick={() => handleDownloadImage(app.idCardBackFileName!)}
                                 className="text-green-600 hover:text-green-800 text-xs underline"
                               >
                                 Download
                               </button>
                             </div>
                           ) : (
                             <span className="text-sm text-gray-500">Not uploaded</span>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>

                  {/* Address */}
                                     <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">
                       Address
                     </h3>
                     <div className="space-y-2 text-sm text-gray-700">
                       <p>{app.address}</p>
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

       {/* Image Modal */}
       {showImageModal && selectedImage && (
         <motion.div
           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.3 }}
         >
           <motion.div
             className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.3 }}
           >
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-gray-800">ID Card Image</h3>
               <button
                 onClick={() => setShowImageModal(false)}
                 className="text-gray-500 hover:text-gray-700"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
                           <div className="flex justify-center">
                <img
                  src={selectedImage}
                  alt="ID Card"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Error loading image:', selectedImage);
                    console.error('Image error details:', e);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC4wMDAxIDgxIDc4IDgxSDEyMkMxMzEuOTk5OSA4MSAxNDAgODkuNTQ0NyAxNDAgMTAwVjEyMEMxNDAgMTMwLjQ1NSAxMzEuOTk5OSAxMzkgMTIyIDEzOUg3OEM2OC4wMDAxIDEzOSA2MCAxMzAuNDU1IDYwIDEyMFYxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgOTQuNDc3MiA4NC40NzcyIDkwIDkwIDkwSDEwMEMxMDUuNTIzIDkwIDExMCA5NC40NzcyIDExMCAxMDBWMTEwQzExMCAxMTUuNTIzIDEwNS41MjMgMTIwIDEwMCAxMjBIOUFDODQuNDc3MiAxMjAgODAgMTE1LjUyMyA4MCAxMTBWMTAwWiIgZmlsbD0iI0Q5RDBEQyIvPgo8L3N2Zz4K';
                    alert(`Failed to load image: ${selectedImage}`);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', selectedImage);
                  }}
                />
              </div>
             <div className="flex justify-center mt-4 space-x-4">
               <button
                 onClick={() => handleDownloadImage(selectedImage.split('/').pop() || '')}
                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Download
               </button>
               <button
                 onClick={() => setShowImageModal(false)}
                 className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
               >
                 Close
               </button>
             </div>
           </motion.div>
         </motion.div>
       )}
     </div>
   );
 } 