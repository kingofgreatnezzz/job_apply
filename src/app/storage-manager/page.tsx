'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { listJobappFiles, deleteFromJobapp, getJobappPublicUrl, getJobappBucketInfo } from '@/lib/storage-utils';
import type { StorageFile } from '@/lib/storage-utils';

export default function StorageManagerPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const fileList = await listJobappFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (file: StorageFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    try {
      const success = await deleteFromJobapp(file.name);
      if (success) {
        setFiles(files.filter(f => f.name !== file.name));
        alert('File deleted successfully!');
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  const showImageModal = (file: StorageFile) => {
    setSelectedFile(file);
    setImageModalOpen(true);
  };

  const downloadFile = async (file: StorageFile) => {
    try {
      const url = getJobappPublicUrl(file.name);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(getJobappPublicUrl(file.name), '_blank');
    }
  };

  const copyUrl = async (file: StorageFile) => {
    try {
      const url = getJobappPublicUrl(file.name);
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const bucketInfo = getJobappBucketInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading storage files...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Storage Manager</h1>
            <p className="text-gray-600 mt-1">Manage files in the jobapp bucket</p>
            
            {/* Bucket Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Bucket Information:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {bucketInfo.name}
                </div>
                <div>
                  <span className="font-medium">Public:</span> {bucketInfo.public ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">File Limit:</span> {formatFileSize(bucketInfo.file_size_limit)}
                </div>
                <div>
                  <span className="font-medium">Total Files:</span> {files.length}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-500">ID: {file.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof file.metadata?.size === 'number' ? formatFileSize(file.metadata.size as number) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(file.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {file.name.includes('front') ? 'Front ID' : 
                         file.name.includes('back') ? 'Back ID' : 'Other'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Preview for images */}
                        {(file.name.includes('.png') || file.name.includes('.jpg') || file.name.includes('.jpeg')) && (
                          <button
                            onClick={() => showImageModal(file)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                            title="Preview"
                          >
                            👁️
                          </button>
                        )}
                        
                        <button
                          onClick={() => downloadFile(file)}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded transition-colors"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        
                        <button
                          onClick={() => copyUrl(file)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded transition-colors"
                          title="Copy URL"
                        >
                          📋
                        </button>
                        
                        <button
                          onClick={() => deleteFile(file)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {files.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No files found in storage</div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {imageModalOpen && selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex justify-center">
                <Image
                  src={getJobappPublicUrl(selectedFile.name)}
                  alt={selectedFile.name}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center p-8">
                        <div class="text-red-500 mb-4">⚠️ Image failed to load</div>
                        <a href="${getJobappPublicUrl(selectedFile.name)}" target="_blank" class="text-blue-500 hover:underline">
                          Open in new tab
                        </a>
                      </div>
                    `;
                  }}
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => window.open(getJobappPublicUrl(selectedFile.name), '_blank')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => copyUrl(selectedFile)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => downloadFile(selectedFile)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
