'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DebugInfo {
  timestamp: string;
  supabaseConfig: {
    url: string | undefined;
    hasKey: boolean;
    keyLength: number;
  };
  buckets: Array<{
    id: string;
    name: string;
    public: boolean;
    file_size_limit?: number;
    allowed_mime_types?: string[];
  }>;
  bucketDetails: {
    id: string;
    name: string;
    public: boolean;
    file_size_limit?: number;
    allowed_mime_types?: string[];
  } | null;
  policies: Array<{
    id: string;
    name: string;
    definition: string;
  }>;
  applications: Array<{
    id: string;
    name: string;
    email: string;
    resume_url?: string;
    created_at: string;
  }>;
  storageTest: {
    uploadSuccess?: boolean;
    downloadSuccess?: boolean;
    error?: string;
    files?: Array<{
      name: string;
      id?: string;
      updated_at?: string;
      created_at?: string;
      last_accessed_at?: string;
      metadata?: Record<string, unknown>;
    }>;
    publicUrlTest?: {
      publicUrl: string;
    };
    createError?: string;
    createSuccess?: {
      name: string;
    };
    createException?: string;
    exception?: string;
  };
  errors: string[];
}

export default function DeepDebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runDeepDebug = async () => {
    setLoading(true);
    setCurrentTest('Starting deep debug...');
    
    const info: DebugInfo = {
      timestamp: new Date().toISOString(),
      supabaseConfig: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      },
      buckets: [],
      bucketDetails: null,
      policies: [],
      applications: [],
      storageTest: {},
      errors: []
    };

    try {
      // 1. Check Supabase Configuration
      setCurrentTest('Checking Supabase configuration...');
      info.supabaseConfig = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      };

      // 2. List all buckets
      setCurrentTest('Listing all storage buckets...');
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
          info.errors.push(`Bucket list error: ${bucketError.message}`);
        } else {
          info.buckets = buckets || [];
        }
      } catch (error) {
        info.errors.push(`Bucket list exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // 3. Check specific jobapp bucket
      setCurrentTest('Checking jobapp bucket specifically...');
      try {
        const { data: bucket, error: bucketError } = await supabase.storage.getBucket('jobapp');
        if (bucketError) {
          info.errors.push(`Jobapp bucket error: ${bucketError.message}`);
        } else {
          info.bucketDetails = bucket;
        }
      } catch (error) {
        info.errors.push(`Jobapp bucket exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // 4. Check storage policies
      setCurrentTest('Checking storage policies...');
      try {
        // This might not work due to permissions, but let's try
        const { data: policies, error: policyError } = await supabase
          .from('storage.policies')
          .select('*');
        if (policyError) {
          info.errors.push(`Policy check error: ${policyError.message}`);
        } else {
          info.policies = policies || [];
        }
      } catch (error) {
        info.errors.push(`Policy check exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // 5. Check applications table
      setCurrentTest('Checking applications table...');
      try {
        const { data: applications, error: appError } = await supabase
          .from('job_applications')
          .select('*')
          .limit(5);
        if (appError) {
          info.errors.push(`Applications table error: ${appError.message}`);
        } else {
          info.applications = applications || [];
        }
      } catch (error) {
        info.errors.push(`Applications table exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // 6. Test storage operations
      setCurrentTest('Testing storage operations...');
      try {
        // Try to list files in jobapp bucket
        const { data: files, error: filesError } = await supabase.storage
          .from('jobapp')
          .list('', { limit: 5 });
        
        if (filesError) {
          info.storageTest.error = filesError.message;
        } else {
          info.storageTest.files = files || [];
        }

        // Try to get a public URL
        const testFileName = 'test_file.txt';
        const { data: urlData } = supabase.storage
          .from('jobapp')
          .getPublicUrl(testFileName);
        info.storageTest.publicUrlTest = urlData;

      } catch (error) {
        info.storageTest.exception = error instanceof Error ? error.message : 'Unknown error';
      }

      // 7. Try to create bucket programmatically
      setCurrentTest('Attempting to create bucket programmatically...');
      try {
        const { data: createData, error: createError } = await supabase.storage.createBucket('jobapp', {
          public: true,
          fileSizeLimit: 52428800,
          allowedMimeTypes: ['image/*', 'application/pdf']
        });
        
        if (createError) {
          info.storageTest.createError = createError.message;
        } else {
          info.storageTest.createSuccess = createData;
        }
      } catch (error) {
        info.storageTest.createException = error instanceof Error ? error.message : 'Unknown error';
      }

    } catch (error) {
      info.errors.push(`Main debug exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setDebugInfo(info);
    setLoading(false);
    setCurrentTest('Debug complete!');
  };

  const createBucketManually = async () => {
    setCurrentTest('Creating bucket manually...');
    try {
        const { error } = await supabase.storage.createBucket('jobapp', {
        public: true,
        fileSizeLimit: 52428800,
        allowedMimeTypes: ['image/*', 'application/pdf']
      });
      
      if (error) {
        alert(`Failed to create bucket: ${error.message}`);
      } else {
        alert('Bucket created successfully! Please run debug again.');
        setDebugInfo(null);
      }
    } catch (err) {
      alert(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setCurrentTest('');
  };

  const runSQLFix = () => {
    const sqlCommands = [
      '-- Run these commands in your Supabase SQL Editor:',
      '',
      '-- 1. Create the bucket',
      "INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES ('jobapp', 'jobapp', true, 52428800, ARRAY['image/*', 'application/pdf']) ON CONFLICT (id) DO NOTHING;",
      '',
      '-- 2. Create storage policy',
      "CREATE POLICY \"Allow all operations on jobapp bucket\" ON storage.objects FOR ALL USING (bucket_id = 'jobapp');",
      '',
      '-- 3. Verify bucket exists',
      "SELECT * FROM storage.buckets WHERE id = 'jobapp';"
    ].join('\n');
    
    navigator.clipboard.writeText(sqlCommands);
    alert('SQL commands copied to clipboard! Paste them in your Supabase SQL Editor.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Deep Debug System</h1>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={runDeepDebug}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Debug...' : 'Run Deep Debug'}
            </button>
            
            <button
              onClick={createBucketManually}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Create Bucket Manually
            </button>
            
            <button
              onClick={runSQLFix}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700"
            >
              Copy SQL Fix Commands
            </button>
          </div>

          {/* Current Test Status */}
          {currentTest && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">{currentTest}</p>
            </div>
          )}

          {/* Debug Results */}
          {debugInfo && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Debug Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Timestamp:</span><br/>
                    {new Date(debugInfo.timestamp).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Buckets Found:</span><br/>
                    {debugInfo.buckets.length}
                  </div>
                  <div>
                    <span className="font-medium">Jobapp Bucket:</span><br/>
                    {debugInfo.bucketDetails ? '✅ Exists' : '❌ Missing'}
                  </div>
                  <div>
                    <span className="font-medium">Errors:</span><br/>
                    {debugInfo.errors.length}
                  </div>
                </div>
              </div>

              {/* Supabase Config */}
              <div>
                <h3 className="text-lg font-semibold mb-2">🔧 Supabase Configuration</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo.supabaseConfig, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Buckets */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📦 Storage Buckets</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo.buckets, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Jobapp Bucket Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2">🎯 Jobapp Bucket Details</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo.bucketDetails, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Storage Test Results */}
              <div>
                <h3 className="text-lg font-semibold mb-2">🧪 Storage Test Results</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo.storageTest, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📝 Applications Table</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(debugInfo.applications, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Errors */}
              {debugInfo.errors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">❌ Errors Found</h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    {debugInfo.errors.map((error, index) => (
                      <div key={index} className="text-red-800 mb-2">
                        <strong>Error {index + 1}:</strong> {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Debug Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Click &quot;Run Deep Debug&quot; to analyze your setup</li>
              <li>If bucket is missing, try &quot;Create Bucket Manually&quot;</li>
              <li>If that fails, use &quot;Copy SQL Fix Commands&quot; and run in Supabase</li>
              <li>Check the debug results for specific error messages</li>
              <li>Look for configuration issues in the results</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
