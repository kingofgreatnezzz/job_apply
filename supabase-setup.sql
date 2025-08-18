-- Create the job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  address TEXT NOT NULL,
  employment_status TEXT NOT NULL,
  ssn TEXT NOT NULL,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  status TEXT DEFAULT 'pending'
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
CREATE POLICY "Allow all operations" ON job_applications
  FOR ALL USING (true);

-- Create storage bucket for job application files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('jobapp', 'jobapp', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public uploads" ON storage.objects;

-- Create storage policies for the jobapp bucket
-- Allow public access to view files
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'jobapp');

-- Allow public uploads to the jobapp bucket
CREATE POLICY "Public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'jobapp');

-- Allow public updates to files in the jobapp bucket
CREATE POLICY "Public updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'jobapp');

-- Allow public deletes from the jobapp bucket
CREATE POLICY "Public deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'jobapp');

-- Grant necessary permissions
GRANT ALL ON job_applications TO authenticated;
GRANT ALL ON job_applications TO anon;
