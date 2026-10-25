import { api } from './apiClient.js';

export const authenticateUser = (mode, credentials) => api(`/api/auth/${mode}`, { method: 'POST', body: credentials });

export const fetchCurrentUser = () => api('/api/auth/me');
