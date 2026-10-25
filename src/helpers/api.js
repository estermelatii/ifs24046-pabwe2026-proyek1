export const rupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

export async function api(path, opt = {}) {
  const token = localStorage.getItem('fg-token');
  const res = await fetch(API_BASEURL + path, {
    method: opt.method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: opt.body ? JSON.stringify(opt.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
  return data;
}
