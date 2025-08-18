import { supabase } from './supabase';

/**
 * Storage utilities that work around the bucket metadata corruption issue
 * We know the jobapp bucket exists and files work, but listBuckets() fails
 */

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

/**
 * List files in the jobapp bucket (bypassing the corrupted bucket metadata)
 */
export async function listJobappFiles(): Promise<StorageFile[]> {
  try {
    // Direct file listing - this works despite bucket metadata corruption
    const { data: files, error } = await supabase.storage
      .from('jobapp')
      .list('', { limit: 1000 });
    
    if (error) {
      console.error('Error listing files:', error);
      return [];
    }
    
    return files || [];
  } catch (error) {
    console.error('Exception listing files:', error);
    return [];
  }
}

/**
 * Upload file to jobapp bucket
 */
export async function uploadToJobapp(file: File, path: string): Promise<{ path: string } | null> {
  try {
    const { data, error } = await supabase.storage
      .from('jobapp')
      .upload(path, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Upload exception:', error);
    return null;
  }
}

/**
 * Delete file from jobapp bucket
 */
export async function deleteFromJobapp(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('jobapp')
      .remove([path]);
    
    if (error) {
      console.error('Delete error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

/**
 * Get public URL for file in jobapp bucket
 */
export function getJobappPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from('jobapp')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Check if a file exists in jobapp bucket
 */
export async function fileExistsInJobapp(path: string): Promise<boolean> {
  try {
    const { data: files, error } = await supabase.storage
      .from('jobapp')
      .list('', { limit: 1, search: path });
    
    if (error) return false;
    
    return files && files.length > 0 && files.some(f => f.name === path);
  } catch {
    return false;
  }
}

/**
 * Get bucket info (returns mock data since bucket metadata is corrupted)
 */
export function getJobappBucketInfo() {
  return {
    id: 'jobapp',
    name: 'jobapp',
    public: true,
    file_size_limit: 52428800, // 50MB
    allowed_mime_types: ['image/*', 'application/pdf', 'text/*']
  };
}
