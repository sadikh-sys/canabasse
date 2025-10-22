import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  price: number;
  file_url: string;
  duration?: number;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserTrack {
  id: string;
  user_id: string;
  track_id: string;
  remaining_listens: number;
  track: Track;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  transaction_id: string;
  track_id?: string;
  created_at: string;
  updated_at: string;
  tracks?: Track;
}
