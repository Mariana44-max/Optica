import { authApi } from './client';

export const register = (data) => authApi.post('/api/auth/register', data).then((r) => r.data);
export const login = (data) => authApi.post('/api/auth/login', data).then((r) => r.data);
export const me = () => authApi.get('/api/auth/me').then((r) => r.data);
