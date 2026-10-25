// Konfigurasi global aplikasi. Satu-satunya tempat yang membaca environment variable.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Catatan keamanan: token di localStorage rentan terhadap XSS; lihat bagian "Keamanan" di README.
export const STORAGE_KEYS = {
  token: 'fg-token',
  cart: 'fg-cart2',
};

export const ADMIN_WHATSAPP_URL = 'https://wa.me/6282160183466';

// Dikirim apiClient saat server menolak token (401); App akan mengeluarkan pengguna.
export const AUTH_EXPIRED_EVENT = 'auth:expired';
