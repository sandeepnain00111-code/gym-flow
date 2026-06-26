import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Load session on startup
  checkAuth: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        set({
          accessToken: token,
          user: JSON.parse(savedUser),
          isAuthenticated: true
        });

        // Verify session freshness with server
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            set({ user: res.data.user });
          }
        } catch (e) {
          // Token is invalid/expired, api.js interceptor will attempt refresh
          console.error('Verify auth failed', e);
        }
      }
    } catch (error) {
      console.error('checkAuth error:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Login action
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { accessToken, refreshToken, user } = res.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          accessToken,
          isAuthenticated: true,
          error: null
        });
        return user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed, check your credentials';
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Register action
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { accessToken, refreshToken, user, message } = res.data;

        // If gym owner, account stays pending.
        if (userData.role === 'gym_owner') {
          return { pending: true, message };
        }

        // For other roles (like member), log them in immediately
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          accessToken,
          isAuthenticated: true,
          error: null
        });
        return user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Logout action
  logout: async () => {
    set({ loading: true });
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error on server:', e.message);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isDevMemberBypass');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false
      });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }
}));
