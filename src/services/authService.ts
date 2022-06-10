import createHttpClient from '@/clients/http';
import createApiClient from '@/clients/api';
import { getRefreshToken, resetAuth, setAuth } from './authStorage';
import router from '@/router';

export type LoginCredentials = {
  email: string;
  password: string;
};

const http = createHttpClient();

export const refreshAccessToken = () =>
  new Promise((resolve, reject) => {
    http
      .post('/refresh_tokens', { token: getRefreshToken() })
      .then((res) => {
        setAuth(res.data.data);
        resolve(res.data.data.token);
      })
      .catch((error) => {
        resetAuth();
        if (error.response?.status === 401) {
          router.push('/login');
        }
        reject(error);
      });
  });

// Login
export const createAccessToken = (credentials: LoginCredentials) =>
  new Promise((resolve, reject) => {
    http
      .post('/login', { ...credentials, remember_me: true })
      .then((res) => {
        setAuth(res.data.data);
        resolve(res.data.data.token);
      })
      .catch((error) => {
        resetAuth();
        reject(error);
      });
  });

export const deleteAccessToken = () => {
  const api = createApiClient();

  return new Promise((resolve, reject) => {
    api
      .delete('/logout')
      .then(() => {
        resetAuth();
        resolve(true);
      })
      .catch((error) => {
        resetAuth();
        reject(error);
      });
  });
};

export const logout = async () => {
  await deleteAccessToken();
  localStorage.removeItem('team_id');
  router.push('/login');
};
