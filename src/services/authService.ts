import api from './api';
import type { LoginRequest, LoginResponse, User } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData: User): Promise<User> => {
    const response = await api.post<User>('/auth/signup', userData);
    return response.data;
  },

  // Fetch current authenticated user's profile (includes roles)
  me: async (): Promise<User> => {
  const response = await api.get<User>('/v1/hars/user/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Attempt to extract a minimal user object from the stored JWT token payload.
  // This is useful when the app has a token but hasn't fetched /me yet.
  getUserFromToken: (): User | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      // base64url -> base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // atob is available in browser environments
      const json = decodeURIComponent(Array.prototype.map.call(atob(b64), function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const obj = JSON.parse(json);
      // Prefer explicit id claims; do NOT use email as an id fallback (avoid using email as user_id)
      const userId = obj.sub ?? obj.user_id ?? obj.userId ?? obj.id ?? obj.userid ?? obj.username ?? undefined;
      const u: User = {
        user_id: userId,
        email: obj.email ?? '',
        fullName: obj.name ?? obj.fullName ?? '',
        phone: obj.phone ?? '',
      };
      return u;
    } catch (e) {
      return null;
    }
  },
};

