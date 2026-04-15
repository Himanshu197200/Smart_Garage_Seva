import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    garageId?: string;
    skills?: string[];
  }): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data!;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data!;
  }
};
