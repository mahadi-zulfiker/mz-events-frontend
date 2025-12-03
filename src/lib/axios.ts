import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const isBrowser = typeof window !== 'undefined';
const STORAGE_PREF_KEY = 'auth_storage';

const getPreferredStorage = () => {
  if (!isBrowser) {
    return null;
  }
  const preference = window.localStorage.getItem(STORAGE_PREF_KEY);
  if (preference === 'local') return window.localStorage;
  if (preference === 'session') return window.sessionStorage;
  if (window.localStorage.getItem('accessToken')) return window.localStorage;
  if (window.sessionStorage.getItem('accessToken'))
    return window.sessionStorage;
  return window.localStorage;
};

const persistAuth = (accessToken?: string, user?: any) => {
  if (!isBrowser) return;
  const storage = getPreferredStorage();
  if (!storage) return;
  if (accessToken) {
    storage.setItem('accessToken', accessToken);
  }
  if (user) {
    storage.setItem('user', JSON.stringify(user));
  }
};

export const clearStoredAuth = () => {
  if (!isBrowser) return;
  ['accessToken', 'user'].forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
  window.localStorage.removeItem(STORAGE_PREF_KEY);
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token =
        window.localStorage.getItem('accessToken') ||
        window.sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with refresh retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const originalRequest: any = error.config || {};
    const requestUrl = String(originalRequest.url || '');

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken, user } = refreshResponse.data.data || {};
        if (accessToken) {
          persistAuth(accessToken, user);
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        clearStoredAuth();
        if (isBrowser) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 401) {
      clearStoredAuth();
      if (isBrowser) {
        window.location.href = '/login';
      }
    }

    if (status === 403 && isBrowser) {
      toast.error('You do not have permission to perform this action');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
