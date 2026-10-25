import { API_BASE_URL, AUTH_EXPIRED_EVENT, STORAGE_KEYS } from '../config.js';

// Klien HTTP tunggal: menambahkan token login, mengirim JSON, dan menyeragamkan pesan error.
export async function api(path, { method, body } = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const response = await fetch(API_BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    // Token ditolak server: beri tahu aplikasi agar sesi dibersihkan.
    if (response.status === 401 && token) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    throw new Error(data.error || 'Terjadi kesalahan');
  }
  return data;
}
