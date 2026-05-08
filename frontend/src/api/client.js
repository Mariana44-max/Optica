import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4001';
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL || 'http://localhost:4002';

export const authApi = axios.create({ baseURL: AUTH_URL });
export const productApi = axios.create({ baseURL: PRODUCT_URL });

function attachToken(client) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

attachToken(authApi);
attachToken(productApi);
