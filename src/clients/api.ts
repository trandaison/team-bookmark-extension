import axios, { type AxiosRequestConfig } from 'axios';
import { refreshAccessToken } from '@/services/authService';
import { getAccessToken } from '@/services/authStorage';
import router from '@/router';

let refreshAccessTokenRequest: Promise<unknown> | null = null;

export default (options: AxiosRequestConfig = {}) => {
  const instance = axios.create({
    baseURL: 'http://localhost:3000/api/v2',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (token) config.headers!.Authorization = `Bearer ${token}`;

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        if (error.config?.__isRetryRequest) {
          refreshAccessTokenRequest = null;
          router.push('/login');
        } else {
          refreshAccessTokenRequest =
            refreshAccessTokenRequest || refreshAccessToken();
          await refreshAccessTokenRequest;
          refreshAccessTokenRequest = null;
          error.config.__isRetryRequest = true;

          return instance.request(error.config);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
