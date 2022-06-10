import axios, { type AxiosRequestConfig } from 'axios';

export default (options: AxiosRequestConfig = {}) =>
  axios.create({
    baseURL: 'http://localhost:3000/api/v2',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
