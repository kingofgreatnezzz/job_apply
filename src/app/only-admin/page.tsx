'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { JobApplication } from '@/lib/supabase';

export default function AdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Refresh the applications list
      fetchApplications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting application:', error);
        return;
      }

      // Refresh the applications list
      fetchApplications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const getImageFileName = (url: string, type: string) => {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      return `${type}_${filename}`;
    } catch {
      return `${type}_image`;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Job Applications Admin</h1>
            <p className="text-gray-600 mt-1">Manage and review job applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Cards
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {app.first_name} {app.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.position}</div>
                      <div className="text-sm text-gray-500">{app.employment_status}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status || 'pending'}
                        onChange={(e) => updateApplicationStatus(app.id!, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {app.id_card_front_url && (
                          <div className="flex flex-col items-center">
                            <div
                              onClick={() => showImageModal(app.id_card_front_url!)}
                              className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                              title="Click to view front ID card"
                            >
                              <span className="text-xs text-gray-600 text-center">Front</span>
                            </div>
                            <div className="flex space-x-1 mt-1">
                              <button
                                onClick={() => downloadImage(app.id_card_front_url!, getImageFileName(app.id_card_front_url!, 'front'))}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                title="Download"
                              >
                                ⬇️
                              </button>
                              <button
                                onClick={() => copyToClipboard(app.id_card_front_url!)}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                title="Copy URL"
                              >
                                📋
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {app.id_card_back_url && (
                          <div className="flex flex-col items-center">
                            <div
                              onClick={() => showImageModal(app.id_card_back_url!)}
                              className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                              title="Click to view back ID card"
                            >
                              <span className="text-xs text-gray-600 text-center">Back</span>
                            </div>
                            <div className="flex space-x-1 mt-1">
                              <button
                                onClick={() => downloadImage(app.id_card_back_url!, getImageFileName(app.id_card_back_url!, 'back'))}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                title="Download"
                              >
                                ⬇️
                              </button>
                              <button
                                onClick={() => copyToClipboard(app.id_card_back_url!)}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                title="Copy URL"
                              >
                                📋
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteApplication(app.id!)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No applications found</div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {imageModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">ID Card Image</h3>
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex justify-center">
                <Image
                  src={selectedImage}
                  alt="ID Card"
                  width={800}
                  height={600}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center p-8">
                        <div class="text-red-500 mb-4">⚠️ Image failed to load</div>
                        <a href="${selectedImage}" target="_blank" class="text-blue-500 hover:underline">
                          Open in new tab
                        </a>
                      </div>
                    `;
                  }}
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => window.open(selectedImage, '_blank')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => copyToClipboard(selectedImage)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 