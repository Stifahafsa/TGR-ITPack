import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const authAPI = axios.create({
  baseURL: BASE_URL,
});

export const materielAPI = axios.create({
  baseURL: BASE_URL,
});

// Intercepteur pour ajouter le token
materielAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion des erreurs
materielAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);