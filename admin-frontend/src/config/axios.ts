import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * 1. SERVER INSTANCE (Used by Server Components & Server Actions in Admin)
 * Talks over the internal Docker network or server-side URL
 */
export const axiosInterceptorInstanceServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
  timeout: 10000,
});

axiosInterceptorInstanceServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 2. CLIENT INSTANCE (Used by Admin Browser Client Components & Redux Thunks)
 * Scoped to admin authorization token
 */
export const axiosInterceptorInstanceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true,
});

axiosInterceptorInstanceClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('aarogyamed_admin_auth_token') ||
        localStorage.getItem('aarogyamed_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Extracts a user-friendly, descriptive error message from any API error.
 */
export function extractApiErrorMessage(error: any, fallback = 'An unexpected error occurred'): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;

  const resData = error.response?.data;
  if (resData) {
    if (resData.message && typeof resData.message === 'string') {
      return resData.message;
    }
    if (resData.error && typeof resData.error === 'string') {
      return resData.error;
    }
    if (Array.isArray(resData.details) && resData.details.length > 0) {
      return resData.details
        .map((d: any) => (d.field ? `${d.field}: ${d.message}` : d.message || String(d)))
        .join(', ');
    }
    if (Array.isArray(resData.errors) && resData.errors.length > 0) {
      return resData.errors
        .map((e: any) => (e.field ? `${e.field}: ${e.message}` : e.message || String(e)))
        .join(', ');
    }
  }

  if (error.message && typeof error.message === 'string') {
    if (error.message === 'Network Error') {
      return 'Unable to connect to AarogyaMed Operations server. Please verify backend service.';
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request to operations service timed out. Please try again.';
    }
    return error.message;
  }

  return fallback;
}

let lastErrorToast = {
  message: '',
  timestamp: 0,
};

function triggerErrorSnackbar(message: string) {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (lastErrorToast.message === message && now - lastErrorToast.timestamp < 1500) {
    return;
  }
  lastErrorToast = { message, timestamp: now };

  window.dispatchEvent(
    new CustomEvent('aarogyamed:toast', {
      detail: { type: 'error', message, duration: 4500 },
    })
  );
}

axiosInterceptorInstanceClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isSilentCheck = url.includes('/auth/me') && status === 401;

    let userFacingMessage = extractApiErrorMessage(error, '');

    if (status === 400 && !userFacingMessage) {
      userFacingMessage = 'Invalid request parameters. Please verify input data.';
    } else if (status === 401) {
      if (typeof window !== 'undefined' && !url.includes('/auth/login')) {
        localStorage.removeItem('aarogyamed_admin_auth_token');
      }
      if (!isSilentCheck && !userFacingMessage) {
        userFacingMessage = 'Admin session expired. Please sign in again.';
      }
    } else if (status === 403) {
      if (!userFacingMessage) {
        userFacingMessage = 'Administrative access denied. Insufficient permissions.';
      }
    } else if (status === 404) {
      if (!userFacingMessage) {
        userFacingMessage = 'Requested admin resource or entity was not found.';
      }
    } else if (status === 409) {
      if (!userFacingMessage) {
        userFacingMessage = 'A conflicting record already exists in the database.';
      }
    } else if (status === 422) {
      if (!userFacingMessage) {
        userFacingMessage = 'Validation failed. Please verify required fields and formats.';
      }
    } else if (status === 429) {
      userFacingMessage = 'Rate limit exceeded. Please wait a moment.';
    } else if (status && status >= 500) {
      userFacingMessage = 'Backend service encountered an error. Please try again.';
    } else if (!error.response && (error.message === 'Network Error' || error.code === 'ERR_NETWORK')) {
      userFacingMessage = 'Unable to connect to AarogyaMed backend API. Check your network.';
    }

    if (!isSilentCheck && userFacingMessage) {
      triggerErrorSnackbar(userFacingMessage);
    }

    if (userFacingMessage) {
      error.message = userFacingMessage;
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptorInstanceClient;

