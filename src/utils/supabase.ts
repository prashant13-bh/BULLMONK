import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aedelnskedncqmqmocoo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_3Q6Jdo45UCWs8Zi-yJesKA_J2DfHTBr';

/**
 * Global Supabase Client Instance
 * Configured with BullMonk environment variables for storage, real-time database, and authentication.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * BullMonk Supabase Storage Engine
 * High-performance browser-native file and image uploads to Supabase Buckets.
 */
export const SupabaseStorage = {
  /**
   * Upload an image, document, or PDF to a Supabase bucket
   * @param bucket - The storage bucket name (e.g., 'articles', 'documents', 'media')
   * @param path - Target storage path (e.g., 'uploads/report.pdf')
   * @param file - File or Blob object
   */
  async uploadFile(bucket: string, path: string, file: File | Blob) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined
      });

    if (error) throw error;
    return data;
  },

  /**
   * Retrieve the permanent public URL for a file in a public bucket
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * Download a file blob from a bucket
   */
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw error;
    return data;
  },

  /**
   * List files within a bucket path
   */
  async listFiles(bucket: string, path = '') {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) throw error;
    return data;
  },

  /**
   * Delete files from a bucket
   */
  async removeFiles(bucket: string, paths: string[]) {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
    return data;
  }
};
