import { create } from 'zustand';
import api, { getErrorMessage } from '../api/axios';

let listRequestId = 0; // ignore out-of-order responses when filters change quickly

export const useNewsStore = create((set, get) => ({
  // News page (paginated list)
  news: [],
  pagination: { page: 1, pages: 1, total: 0 },
  listLoading: false,
  listError: null,

  // Home page sections
  latest: [],
  top: [],
  categories: [],
  homeLoading: false,

  // Single story
  current: null,
  related: [],
  detailLoading: false,
  detailError: null,

  // Logged-in user's stories
  myNews: [],
  myLoading: false,

  fetchNews: async (params = {}) => {
    const id = ++listRequestId;
    set({ listLoading: true, listError: null });
    try {
      const { data } = await api.get('/news', { params });
      if (id !== listRequestId) return;
      set({ news: data.news, pagination: { page: data.page, pages: data.pages, total: data.total } });
    } catch (err) {
      if (id === listRequestId) set({ listError: getErrorMessage(err), news: [] });
    } finally {
      if (id === listRequestId) set({ listLoading: false });
    }
  },

  fetchHome: async () => {
    set({ homeLoading: true });
    try {
      const [latest, top, cats] = await Promise.all([
        api.get('/news', { params: { limit: 5, sort: 'latest' } }),
        api.get('/news/top', { params: { limit: 6 } }),
        api.get('/news/categories'),
      ]);
      set({ latest: latest.data.news, top: top.data.news, categories: cats.data.categories });
    } catch {
      /* sections stay empty and show their empty state */
    } finally {
      set({ homeLoading: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length) return;
    try {
      const { data } = await api.get('/news/categories');
      set({ categories: data.categories });
    } catch {
      /* ignore */
    }
  },

  // Returns stories for a category without touching the list state.
  fetchByCategory: async (category, limit = 3) => {
    const { data } = await api.get('/news', { params: { category, limit } });
    return data.news;
  },

  fetchNewsById: async (id, { edit = false } = {}) => {
    set({ detailLoading: true, detailError: null, current: null, related: [] });
    try {
      const { data } = await api.get(`/news/${id}`, { params: edit ? { edit: 1 } : {} });
      set({ current: data.news, related: data.related });
      return data.news;
    } catch (err) {
      set({ detailError: getErrorMessage(err) });
      return null;
    } finally {
      set({ detailLoading: false });
    }
  },

  fetchMyNews: async () => {
    set({ myLoading: true });
    try {
      const { data } = await api.get('/news/mine');
      set({ myNews: data.news });
    } finally {
      set({ myLoading: false });
    }
  },

  createNews: async (payload) => {
    const { data } = await api.post('/news', payload);
    return data.news;
  },

  updateNews: async (id, payload) => {
    const { data } = await api.put(`/news/${id}`, payload);
    return data.news;
  },

  deleteNews: async (id) => {
    await api.delete(`/news/${id}`);
    set({ myNews: get().myNews.filter((n) => n._id !== id) });
  },
}));
