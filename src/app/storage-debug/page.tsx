'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

export default function StorageDebugPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStorageFiles();
  }, []);

  const fetchStorageFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('jobapp')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        throw error;
      }

      setFiles(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch storage files');
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('jobapp')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const downloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('jobapp')
        .download(fileName);

      if (error) {
        throw error;
      }

      // Create blob URL and download
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading storage files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchStorageFiles}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Storage Debug - Jobapp Bucket</h1>
            <p className="text-gray-600 mt-1">
              Total files: {files.length}
            </p>
            <button
              onClick={fetchStorageFiles}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Public URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => {
                  const publicUrl = getPublicUrl(file.name);
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
                  
                  return (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">ID: {file.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isImage ? (
                          <Image
                            src={publicUrl}
                            alt={file.name}
                            width={80}
                            height={64}
                            className="w-20 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC4wMDAxIDgxIDc4IDgxSDEyMkMxMzEuOTk5OSA4MSAxNDAgODkuNTQ0NyAxNDAgMTAwVjEyMEMxNDAgMTMwLjQ1NSAxMzEuOTk5OSAxMzkgMTIyIDEzOUg3OEM2OC4wMDAxIDEzOSA2MCAxMzAuNDU1IDYwIDEyMFYxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxMDBDOCA5NC40NzcyIDg0LjQ3NzIgOTAgOTAgOTBIMTAwQzEwNS41MjMgOTAgMTEwIDk0LjQ3NzIgMTEwIDEwMFYxMTBDMTEwIDExNS41MjMgMTA1LjUyMyAxMjAgMTAwIDEyMEg5QUM4NC40NzcyIDEyMCA4MCAxMTUuNTIzIDgwIDExMFYxMDBaIiBmaWxsPSIjRDlEMURDIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-200 rounded border flex items-center justify-center">
                            <span className="text-xs text-gray-500">Not Image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500 break-all max-w-xs">
                          {publicUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadFile(file.name)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Download
                          </button>
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            Open
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {files.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-500">No files are currently in the jobapp storage bucket.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
