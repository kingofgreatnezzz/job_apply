-- Fix storage bucket and policies
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the bucket exists
SELECT * FROM storage.buckets WHERE id = 'jobapp';

-- 2. If no bucket exists, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'jobapp', 
  'jobapp', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/*', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 3. Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public updates" ON storage.objects;
DROP POLICY IF EXISTS "Public deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow all storage operations" ON storage.objects;

-- 4. Create new, simple policies that allow all operations on the jobapp bucket
CREATE POLICY "Allow all operations on jobapp bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'jobapp');

-- 5. Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'jobapp';

-- 6. Check if there are any objects in the bucket
SELECT * FROM storage.objects WHERE bucket_id = 'jobapp';
