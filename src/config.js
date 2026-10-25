// Konfigurasi global aplikasi. Satu-satunya tempat yang membaca environment variable.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  token: 'fg-token',
  cart: 'fg-cart2',
};

export const ADMIN_WHATSAPP_URL = 'https://wa.me/6282160183466';
