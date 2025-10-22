export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  tracks?: UserTrack[];
  payments?: Payment[];
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  price: number;
  fileUrl: string;
  duration?: number;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTrack {
  id: number;
  userId: number;
  trackId: number;
  remainingListens: number;
  track: Track;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  trackId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PlayTrackResponse {
  success: boolean;
  data: {
    track: {
      id: number;
      title: string;
      artist: string;
      duration?: number;
      coverUrl?: string;
    };
    playUrl: string;
    remainingListens: number;
  };
}

export interface PaymentRequest {
  amount: number;
  trackId?: number;
  paymentMethod: 'orange_money' | 'wave' | 'free_money' | 'visa';
  phone?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: number;
    transactionId: string;
    amount: number;
    status: string;
    paymentUrl: string;
    trackId?: number;
  };
}
