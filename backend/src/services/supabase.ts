import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

class SupabaseService {
  private client: SupabaseClient;
  private config: SupabaseConfig;

  constructor() {
    this.config = {
      url: process.env.SUPABASE_URL!,
      anonKey: process.env.SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    };

    this.client = createClient(this.config.url, this.config.serviceRoleKey);
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    filePath: string,
    file: Buffer,
    contentType: string
  ): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    return { data, error };
  }

  /**
   * Generate a signed URL for secure access to a file
   */
  async getSignedUrl(
    bucket: string,
    filePath: string,
    expiresIn: number = 3600
  ): Promise<{ data: { signedUrl: string } | null; error: any }> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    return { data, error };
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(
    bucket: string,
    filePath: string
  ): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .remove([filePath]);

    return { data, error };
  }

  /**
   * Get public URL for a file (for non-sensitive files like covers)
   */
  getPublicUrl(bucket: string, filePath: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * List files in a bucket
   */
  async listFiles(
    bucket: string,
    folder?: string
  ): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .list(folder);

    return { data, error };
  }
}

export default new SupabaseService();
