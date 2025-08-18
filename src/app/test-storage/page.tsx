'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestStoragePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');
  const [bucketInfo, setBucketInfo] = useState<{
    exists?: boolean;
    bucket?: {
      id: string;
      name: string;
      public: boolean;
      file_size_limit?: number;
      allowed_mime_types?: string[];
    };
    allBuckets?: Array<{
      id: string;
      name: string;
      public: boolean;
      file_size_limit?: number;
      allowed_mime_types?: string[];
    }>;
    files?: Array<{
      name: string;
      id?: string;
      updated_at?: string;
      created_at?: string;
      last_accessed_at?: string;
      metadata?: Record<string, unknown>;
    }>;
    filesError?: string;
    error?: string;
  } | null>(null);

  const checkBucket = async () => {
    try {
      // Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        setBucketInfo({ error: bucketError.message });
        return;
      }

      const jobappBucket = buckets.find(b => b.id === 'jobapp');
      setBucketInfo({ 
        exists: !!jobappBucket, 
        bucket: jobappBucket,
        allBuckets: buckets 
      });

      if (jobappBucket) {
        // Try to list files in the bucket
        const { data: files, error: filesError } = await supabase.storage
          .from('jobapp')
          .list('', { limit: 10 });
        
        if (filesError) {
          setBucketInfo(prev => ({ ...prev, filesError: filesError.message }));
        } else {
          setBucketInfo(prev => ({ ...prev, files: files }));
        }
      }
    } catch (error) {
      setBucketInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadResult('');

      const fileName = `test_${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from('jobapp')
        .upload(fileName, file);

      if (error) {
        setUploadResult(`Upload failed: ${error.message}`);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('jobapp')
        .getPublicUrl(fileName);

      setUploadResult(`Upload successful! File: ${fileName}, URL: ${urlData.publicUrl}`);
    } catch (error) {
      setUploadResult(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Storage Test Page</h1>
          
          {/* Check Bucket Status */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Check Bucket Status</h2>
            <button
              onClick={checkBucket}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Check Bucket
            </button>
            
            {bucketInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Bucket Information:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(bucketInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Test Upload */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Test File Upload</h2>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              <button
                onClick={uploadFile}
                disabled={!file || uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Test File'}
              </button>

              {uploadResult && (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Upload Result:</h3>
                  <p className="text-sm">{uploadResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Click &quot;Check Bucket&quot; to see if the jobapp bucket exists</li>
              <li>If bucket doesn&apos;t exist, run the fix-storage.sql script in Supabase</li>
              <li>Try uploading a test file to verify storage works</li>
              <li>Check the upload result for any errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
