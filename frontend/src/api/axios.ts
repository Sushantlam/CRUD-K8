import axios from 'axios';

interface AxiosRequestConfigWithAuth extends Record<string, unknown> {
  headers?: Record<string, string>;
}

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const typedConfig = config as AxiosRequestConfigWithAuth;
    typedConfig.headers = {
      ...(typedConfig.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default api;
