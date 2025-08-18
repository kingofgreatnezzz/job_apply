'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DeepStorageDebugPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runDeepDebug = async () => {
    setLoading(true);
    setResult('🔍 Deep Storage Investigation...\n');
    
    try {
      // Test 1: List all buckets via API
      setResult(prev => prev + '\n1. API Bucket Listing:\n');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        setResult(prev => prev + `❌ API Error: ${bucketError.message}\n`);
      } else {
        setResult(prev => prev + `✅ API Found: ${buckets?.length || 0} buckets\n`);
        buckets?.forEach(bucket => {
          setResult(prev => prev + `   - ${bucket.id} (${bucket.name})\n`);
        });
      }

      // Test 2: Try to access specific bucket names
      setResult(prev => prev + '\n2. Individual Bucket Access:\n');
      const bucketNames = ['jobapp', 'jobappp', 'production', 'default'];
      
      for (const bucketName of bucketNames) {
        try {
          const { data: bucket, error } = await supabase.storage.getBucket(bucketName);
          if (error) {
            setResult(prev => prev + `   ❌ ${bucketName}: ${error.message}\n`);
          } else {
            setResult(prev => prev + `   ✅ ${bucketName}: ${bucket.id} (${bucket.name})\n`);
          }
        } catch {
          setResult(prev => prev + `   ❌ ${bucketName}: Exception\n`);
        }
      }

      // Test 3: File listing in different buckets
      setResult(prev => prev + '\n3. File Listing by Bucket:\n');
      
      for (const bucketName of bucketNames) {
        try {
          const { data: files, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 10 });
          
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

      // Test 4: Check if we can upload to jobapp
      setResult(prev => prev + '\n4. Upload Test to jobapp:\n');
      try {
        // Create a small test file
        const testContent = 'test file content';
        const testBlob = new Blob([testContent], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('jobapp')
          .upload(`test_${Date.now()}.txt`, testFile);
        
        if (uploadError) {
          setResult(prev => prev + `❌ Upload failed: ${uploadError.message}\n`);
        } else {
          setResult(prev => prev + `✅ Upload successful: ${uploadData.path}\n`);
          
          // Try to delete the test file
          const { error: deleteError } = await supabase.storage
            .from('jobapp')
            .remove([uploadData.path]);
          
          if (deleteError) {
            setResult(prev => prev + `⚠️ Test file deletion failed: ${deleteError.message}\n`);
          } else {
            setResult(prev => prev + `✅ Test file deleted successfully\n`);
          }
        }
      } catch (error) {
        setResult(prev => prev + `❌ Upload exception: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      }

      // Test 5: Check public URL generation
      setResult(prev => prev + '\n5. Public URL Generation:\n');
      try {
        const { data: urlData } = supabase.storage
          .from('jobapp')
          .getPublicUrl('test_file.txt');
        
        setResult(prev => prev + `✅ Public URL: ${urlData.publicUrl}\n`);
      } catch (error) {
        setResult(prev => prev + `❌ URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      }

    } catch (error) {
      setResult(prev => prev + `❌ Main exception: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
    
    setLoading(false);
    setResult(prev => prev + '\n🔍 Investigation complete!\n');
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Deep Storage Investigation</h1>
          
          <div className="mb-6">
            <button
              onClick={runDeepDebug}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Investigating...' : 'Run Deep Investigation'}
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
              <h3 className="font-semibold mb-2">Investigation Results:</h3>
              <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🧠 Analysis:</h3>
            <p className="text-sm text-yellow-700">
              This investigation will help us understand why:<br/>
              • Files exist in jobapp bucket<br/>
              • But listBuckets() shows 0 buckets<br/>
              • And getBucket() says &quot;Bucket not found&quot;<br/>
              <br/>
              This suggests a <strong>storage metadata corruption</strong> issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
