'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateBucketPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createBucket = async () => {
    setLoading(true);
    setResult('Attempting to create bucket...\n');
    
    try {
      // Method 1: Try direct bucket creation
      setResult(prev => prev + '1. Trying direct bucket creation...\n');
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('jobapp', {
        public: true,
        fileSizeLimit: 52428800,
        allowedMimeTypes: ['image/*', 'application/pdf']
      });
      
      if (bucketError) {
        setResult(prev => prev + `❌ Direct creation failed: ${bucketError.message}\n`);
      } else {
        setResult(prev => prev + `✅ Bucket created successfully: ${bucketData?.name || 'Unknown'}\n`);
        return;
      }

      // Method 2: Try with different options
      setResult(prev => prev + '\n2. Trying with minimal options...\n');
      const { data: bucketData2, error: bucketError2 } = await supabase.storage.createBucket('jobapp', {
        public: true
      });
      
      if (bucketError2) {
        setResult(prev => prev + `❌ Minimal creation failed: ${bucketError2.message}\n`);
      } else {
        setResult(prev => prev + `✅ Bucket created with minimal options: ${bucketData2?.name || 'Unknown'}\n`);
        return;
      }

      // Method 3: Try different bucket name
      setResult(prev => prev + '\n3. Trying with different bucket name...\n');
      const { data: bucketData3, error: bucketError3 } = await supabase.storage.createBucket('jobapp2', {
        public: true
      });
      
      if (bucketError3) {
        setResult(prev => prev + `❌ Alternative name failed: ${bucketError3.message}\n`);
      } else {
        setResult(prev => prev + `✅ Alternative bucket created: ${bucketData3?.name || 'Unknown'}\n`);
        setResult(prev => prev + '⚠️ You may need to update your code to use "jobapp2"\n');
        return;
      }

    } catch (error) {
      setResult(prev => prev + `❌ Exception: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
    
    setLoading(false);
    setResult(prev => prev + '\n❌ All methods failed. Manual creation required.\n');
  };

  const testBucketAfterCreation = async () => {
    setResult(prev => prev + '\n🧪 Testing bucket access after creation...\n');
    
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        setResult(prev => prev + `❌ Bucket list error: ${error.message}\n`);
      } else {
        setResult(prev => prev + `✅ Found ${buckets?.length || 0} buckets\n`);
        buckets?.forEach(bucket => {
          setResult(prev => prev + `   - ${bucket.id} (${bucket.name})\n`);
        });
      }
    } catch (error) {
      setResult(prev => prev + `❌ Test exception: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🪣 Create Storage Bucket</h1>
          
          <div className="mb-6">
            <button
              onClick={createBucket}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bucket'}
            </button>
            
            <button
              onClick={testBucketAfterCreation}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Bucket Access
            </button>
            
            <button
              onClick={clearResult}
              className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>

          {result && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Click &quot;Create Bucket&quot; to attempt automatic creation</li>
              <li>If successful, click &quot;Test Bucket Access&quot; to verify</li>
              <li>If all methods fail, manual creation in Supabase UI is required</li>
              <li>Make sure to name the bucket exactly &quot;jobapp&quot;</li>
            </ol>
          </div>

          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Manual Creation Required:</h3>
            <p className="text-sm text-red-700">
              If automatic creation fails, you must manually create the bucket in Supabase:<br/>
              1. Go to Storage → New Bucket<br/>
              2. Bucket ID: <strong>jobapp</strong><br/>
              3. Name: <strong>jobapp</strong><br/>
              4. Public bucket: <strong>CHECKED</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
