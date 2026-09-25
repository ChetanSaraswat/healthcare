import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * 1. SERVER INSTANCE (Used by Server Components & Server Actions)
 * Talks over the internal Docker network or server-side URL
 */
export const axiosInterceptorInstanceServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

axiosInterceptorInstanceServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // In server actions or SSR, headers/cookies can be attached if needed
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 2. CLIENT INSTANCE (Used by Browser Client Components & Redux Thunks)
 * Talks over the host port / public URL
 */
export const axiosInterceptorInstanceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInterceptorInstanceClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('aarogyamed_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default axiosInterceptorInstanceClient;
