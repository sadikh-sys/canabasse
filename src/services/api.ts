import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  ApiResponse, 
  Track, 
  UserTrack, 
  Payment, 
  PlayTrackResponse,
  PaymentRequest,
  PaymentResponse,
  User
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/profile');
    return response.data;
  },
};

// Tracks API
export const tracksAPI = {
  getAllTracks: async (): Promise<ApiResponse<Track[]>> => {
    const response: AxiosResponse<ApiResponse<Track[]>> = await api.get('/tracks');
    return response.data;
  },

  getTrackById: async (id: number): Promise<ApiResponse<Track>> => {
    const response: AxiosResponse<ApiResponse<Track>> = await api.get(`/tracks/${id}`);
    return response.data;
  },

  playTrack: async (id: number): Promise<PlayTrackResponse> => {
    const response: AxiosResponse<PlayTrackResponse> = await api.post(`/tracks/${id}/play`);
    return response.data;
  },

  getUserTracks: async (): Promise<ApiResponse<UserTrack[]>> => {
    const response: AxiosResponse<ApiResponse<UserTrack[]>> = await api.get('/tracks/user/tracks');
    return response.data;
  },

  purchaseTrack: async (id: number): Promise<ApiResponse<UserTrack>> => {
    const response: AxiosResponse<ApiResponse<UserTrack>> = await api.post(`/tracks/${id}/purchase`);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response: AxiosResponse<PaymentResponse> = await api.post('/payments', paymentData);
    return response.data;
  },

  verifyPayment: async (transactionId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(`/payments/verify/${transactionId}`);
    return response.data;
  },

  getPaymentStatus: async (transactionId: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(`/payments/status/${transactionId}`);
    return response.data;
  },

  getUserPayments: async (): Promise<ApiResponse<Payment[]>> => {
    const response: AxiosResponse<ApiResponse<Payment[]>> = await api.get('/payments/user');
    return response.data;
  },
};

export default api;
