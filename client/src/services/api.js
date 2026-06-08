import axios from 'axios';
import { store } from '../store';
import { setAccessToken, logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,  // sends HTTP-only refresh cookie
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — auto-refresh on 401
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => { refreshSubscribers.forEach((cb) => cb(token)); refreshSubscribers = []; };

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => subscribeToRefresh((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        }));
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        store.dispatch(setAccessToken(data.accessToken));
        onRefreshed(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
