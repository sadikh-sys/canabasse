import { supabase, Track, UserTrack, Payment } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Auth functions
export const signUp = async (email: string, password: string, name: string, phone?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone
      }
    }
  });

  if (error) throw error;

  // Créer le profil utilisateur
  if (data.user) {
    await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name,
        phone
      });
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Track functions
export const getTracks = async (): Promise<Track[]> => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTrackById = async (id: string): Promise<Track | null> => {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getUserTracks = async (userId: string): Promise<UserTrack[]> => {
  const { data, error } = await supabase
    .from('user_tracks')
    .select(`
      *,
      track:tracks(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
};

export const purchaseTrack = async (userId: string, trackId: string) => {
  const { data, error } = await supabase
    .from('user_tracks')
    .insert({
      user_id: userId,
      track_id: trackId,
      remaining_listens: 10
    });

  if (error) throw error;
  return data;
};

// Payment functions
export const createPayment = async (amount: number, trackId: string, userId: string, paymentMethod: string, phone?: string) => {
  const response = await fetch(`${API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      trackId,
      userId,
      paymentMethod,
      phone
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création du paiement');
  }

  return response.json();
};

export const verifyPayment = async (transactionId: string) => {
  const response = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ transactionId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la vérification du paiement');
  }

  return response.json();
};

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  const response = await fetch(`${API_URL}/payments/${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des paiements');
  }

  const data = await response.json();
  return data.data || [];
};
