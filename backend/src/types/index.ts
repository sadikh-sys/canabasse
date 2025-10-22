export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tracks?: UserTrack[];
  payments?: Payment[];
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  price: number;
  fileUrl: string;
  duration?: number;
  coverUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTrack {
  id: number;
  userId: number;
  trackId: number;
  remainingListens: number;
  track: Track;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  trackId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
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

// Types manquants
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface FedaPayConfig {
  apiKey: string;
  environment: 'sandbox' | 'live';
}