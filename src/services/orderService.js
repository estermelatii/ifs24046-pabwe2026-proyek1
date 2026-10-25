import { api } from './apiClient.js';

export const fetchMyOrders = () => api('/api/my/orders');

export const fetchOrder = (code) => api(`/api/orders/${code}`);

export const createOrder = (order) => api('/api/orders', { method: 'POST', body: order });

export const markOrderReceived = (code) => api(`/api/orders/${code}/received`, { method: 'POST' });

export const updateOrderStatus = (code, status) => api(`/api/orders/${code}/status`, { method: 'PATCH', body: { status } });
