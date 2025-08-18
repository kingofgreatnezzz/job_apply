# Supabase Setup for Job Application System

## 1. Environment Variables

Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ghonihdptsoqgiogyorv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob25paGRwdHNvcWdpb2d5b3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTAwNTIsImV4cCI6MjA3MTA4NjA1Mn0.7KhXSdPKCB7VpUC3_pG5Ua-TEVyYI19aG5dLecIMHOM
```

## 2. Database Setup

Run the SQL script in `supabase-setup.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `ghonihdptsoqgiogyorv`
3. Go to SQL Editor
4. Copy and paste the contents of `supabase-setup.sql`
5. Click "Run" to execute the script

## 3. Storage Bucket

The script will create a storage bucket called `jobapp` for storing ID card images.

## 4. Table Structure

The `job_applications` table will have these columns:

- `id` - Unique identifier (UUID)
- `created_at` - Timestamp when application was submitted
- `first_name` - Applicant's first name
- `last_name` - Applicant's last name
- `email` - Email address
- `phone` - Phone number
- `position` - Position applied for
- `address` - Full address
- `employment_status` - Current employment status
- `ssn` - Social Security Number
- `id_card_front_url` - URL to front ID card image
- `id_card_back_url` - URL to back ID card image
- `status` - Application status (pending, reviewing, approved, rejected)

## 5. Features

✅ **Form Submission**: Job applications are stored in Supabase database
✅ **File Uploads**: ID card images are stored in Supabase Storage
✅ **Admin Dashboard**: View all applications at `/only-admin`
✅ **Status Management**: Update application status (pending, reviewing, approved, rejected)
✅ **Delete Applications**: Remove applications from the system
✅ **Production Ready**: Works on Vercel and other serverless platforms

## 6. Testing

1. Start your development server: `npm run dev`
2. Submit a job application through the form
3. Check the admin page at `/only-admin` to see the submitted application
4. Verify that images are uploaded to Supabase Storage

## 7. Security Notes

- The current setup allows public access to the storage bucket
- Consider implementing authentication for the admin page in production
- SSN data is stored as plain text - consider encryption for production use
- Row Level Security (RLS) is enabled but currently allows all operations

## 8. Production Deployment

When deploying to Vercel:

1. Add the environment variables in your Vercel project settings
2. The system will automatically use Supabase instead of local file storage
3. All data will be persisted in your Supabase database
4. Images will be stored in Supabase Storage with public URLs
