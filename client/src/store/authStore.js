import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      register: async (form) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/register', form);
          set({ user: data.user, token: data.token });
          return data.user;
        } finally {
          set({ loading: false });
        }
      },

      login: async (form) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', form);
          set({ user: data.user, token: data.token });
          return data.user;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({ user: null, token: null }),

      // Re-validate the stored token on app start.
      refreshUser: async () => {
        if (!get().token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          /* the response interceptor logs the user out on 401 */
        }
      },

      updateProfile: async (payload) => {
        const { data } = await api.put('/users/profile', payload);
        set({ user: data.user });
        return data.user;
      },

      changePassword: async (payload) => {
        const { data } = await api.put('/users/password', payload);
        return data.message;
      },
    }),
    {
      name: 'ground-report-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
