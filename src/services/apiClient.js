import { API_BASE_URL, STORAGE_KEYS } from '../config.js';

// Klien HTTP tunggal: menambahkan token login, mengirim JSON, dan menyeragamkan pesan error.
export async function api(path, { method, body } = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const response = await fetch(API_BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');
  return data;
}
