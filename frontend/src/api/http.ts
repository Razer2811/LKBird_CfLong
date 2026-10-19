import axios from 'axios';

const baseURL = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:8080';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

      return http(originalRequest);
    }

    return Promise.reject(error);
  },
);