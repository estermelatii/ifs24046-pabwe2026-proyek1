// Batas dan pola input form. Dipakai sebagai atribut HTML (minLength, pattern, dst.)
// agar validasi browser berjalan sebelum data dikirim ke server.
export const LIMITS = {
  name: { min: 2, max: 60 },
  email: { max: 100 },
  password: { min: 6, max: 72 },
  address: { min: 10, max: 200 },
  city: { min: 2, max: 50 },
  cardMessage: { max: 200 },
  search: { max: 50 },
  orderCode: { max: 20 },
};

// Nomor ponsel Indonesia: 08xx..., 628xx..., atau +628xx... (9-13 digit setelah awalan 8).
export const PHONE_PATTERN = String.raw`(\+62|62|0)8[0-9]{7,12}`;
export const PHONE_HINT = "Contoh: 081234567890";

export const MAX_ORDER_QUANTITY = 99;
export const MAX_DELIVERY_DAYS_AHEAD = 365;
