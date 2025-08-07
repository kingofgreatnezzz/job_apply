'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface JobApplicationFormProps {
  positions: string[];
}

const employmentStatuses = [
  'Currently Employed',
  'Unemployed',
  'Student',
  'Retired',
  'Self-Employed',
  'Part-time'
];

export default function JobApplicationForm({ positions }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    employmentStatus: '',
    ssn: '',
    idCardFront: null as File | null,
    idCardBack: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fieldName = e.target.name;
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: formDataToSend,
      });

             if (response.ok) {
         setShowSuccessModal(true);
         setFormData({
           firstName: '',
           lastName: '',
           email: '',
           phone: '',
           position: '',
           address: '',
           employmentStatus: '',
           ssn: '',
           idCardFront: null,
           idCardBack: null
         });
       } else {
         alert('Error submitting application. Please try again.');
       }
         } catch (err) {
      alert('Error submitting application. Please try again.');
    } finally {
       setIsSubmitting(false);
     }
  };

  return (
    <motion.div
      className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Position Applying For *
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Employment Status *
            </label>
            <select
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select employment status</option>
              {employmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Social Security Number (SSN) *
          </label>
          <input
            type="password"
            name="ssn"
            value={formData.ssn}
            onChange={handleInputChange}
            required
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
            placeholder="XXX-XX-XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Format: XXX-XX-XXXX
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Upload Valid ID Card (Front & Back) *
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Please upload both the front and back sides of your ID card for verification purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front of ID Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front of ID Card *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="idCardFront"
                  onChange={handleFileChange}
                  required
                  accept="image/*,.pdf"
                  className="hidden"
                  id="idCardFrontUpload"
                />
                <label htmlFor="idCardFrontUpload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      <span className="font-medium text-sm">Front Side</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF</p>
                  </div>
                </label>
              </div>
              {formData.idCardFront && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {formData.idCardFront.name} selected
                </p>
              )}
            </div>

            {/* Back of ID Card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back of ID Card *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="idCardBack"
                  onChange={handleFileChange}
                  required
                  accept="image/*,.pdf"
                  className="hidden"
                  id="idCardBackUpload"
                />
                <label htmlFor="idCardBackUpload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      <span className="font-medium text-sm">Back Side</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF</p>
                  </div>
                </label>
              </div>
              {formData.idCardBack && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {formData.idCardBack.name} selected
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </motion.button>
                 </div>
       </form>

       {/* Success Modal */}
       {showSuccessModal && (
         <motion.div
           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.3 }}
         >
           <motion.div
             className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.3 }}
           >
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                           <p className="text-gray-600 mb-6">
                Thank you for your application. We&apos;ll review your information and contact you soon.
              </p>
             <button
               onClick={() => setShowSuccessModal(false)}
               className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
             >
               Close
             </button>
           </motion.div>
         </motion.div>
       )}
     </motion.div>
   );
 } 