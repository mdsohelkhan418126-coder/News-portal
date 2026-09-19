import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the JWT to every request when the user is logged in.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server rejects our token, drop the stale session.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) =>
  err.response?.data?.message || (err.request ? 'Cannot reach the server. Check your connection.' : err.message) || 'Something went wrong';

export default api;
