import { api } from './apiClient.js';

const POPULAR_PRODUCTS_QUERY = 'sort=popular&limit=4';

export const fetchCategories = () => api('/api/categories');

export const fetchProducts = (query) => api(`/api/products?${query}`);

export const fetchPopularProducts = () => fetchProducts(POPULAR_PRODUCTS_QUERY);

export const fetchProduct = (id) => api(`/api/products/${id}`);

export const fetchProductReviews = (id) => api(`/api/products/${id}/reviews`);

export const fetchRecommendations = (answers) => api(`/api/recommend?${new URLSearchParams(answers)}`);
