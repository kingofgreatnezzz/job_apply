'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestBucketPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBucket = async () => {
    setLoading(true);
    setResult('Testing bucket access...\n');
    
    try {
      // Test 1: List all buckets
      setResult(prev => prev + '1. Listing all buckets...\n');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        setResult(prev => prev + `❌ Bucket list error: ${bucketError.message}\n`);
      } else {
        setResult(prev => prev + `✅ Found ${buckets?.length || 0} buckets\n`);
        buckets?.forEach(bucket => {
          setResult(prev => prev + `   - ${bucket.id} (${bucket.name})\n`);
        });
      }

      // Test 2: Try different bucket names
      setResult(prev => prev + '\n2. Testing different bucket names...\n');
      
      const bucketNames = ['jobapp', 'jobappp', 'jobappbucket', 'job'];
      for (const bucketName of bucketNames) {
        try {
          const { error } = await supabase.storage.getBucket(bucketName);
          if (error) {
            setResult(prev => prev + `   ❌ ${bucketName}: ${error.message}\n`);
          } else {
            setResult(prev => prev + `   ✅ ${bucketName}: Found!\n`);
          }
        } catch {
          setResult(prev => prev + `   ❌ ${bucketName}: Exception\n`);
        }
      }

      // Test 3: Try to list files in different buckets
      setResult(prev => prev + '\n3. Testing file listing in different buckets...\n');
      
      for (const bucketName of bucketNames) {
        try {
          const { data: files, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 5 });
          
          if (error) {
            setResult(prev => prev + `   ❌ ${bucketName}: ${error.message}\n`);
          } else {
            setResult(prev => prev + `   ✅ ${bucketName}: ${files?.length || 0} files\n`);
            if (files && files.length > 0) {
              files.forEach(file => {
                setResult(prev => prev + `      - ${file.name}\n`);
              });
            }
          }
        } catch {
          setResult(prev => prev + `   ❌ ${bucketName}: Exception\n`);
        }
      }

      // Test 4: Check if we can access the files we know exist
      setResult(prev => prev + '\n4. Testing known file access...\n');
      const knownFiles = [
        '1755512098845_front_Screenshot (127).png',
        '1755512100575_back_Screenshot (128).png',
        '1755513760991_front_Screenshot (128).png'
      ];
      
      for (const fileName of knownFiles) {
        try {
          // Try to get public URL
          const { data: urlData } = supabase.storage
            .from('jobapp')
            .getPublicUrl(fileName);
          
          setResult(prev => prev + `   📁 ${fileName}: ${urlData.publicUrl}\n`);
        } catch {
          setResult(prev => prev + `   ❌ ${fileName}: Error\n`);
        }
      }

    } catch (error) {
      setResult(prev => prev + `❌ Exception: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
    
    setLoading(false);
    setResult(prev => prev + '\n✅ Test complete!');
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🧪 Storage Bucket Test</h1>
          
          <div className="mb-6">
            <button
              onClick={testBucket}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Bucket Access'}
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
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Click &quot;Test Bucket Access&quot; to diagnose the issue</li>
              <li>If bucket doesn&apos;t exist, create it manually in Supabase UI</li>
              <li>Check the test results for specific error messages</li>
              <li>Look for &quot;Bucket not found&quot; or similar errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
