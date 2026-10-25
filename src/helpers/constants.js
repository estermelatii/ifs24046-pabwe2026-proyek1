// Konstanta domain yang dipakai lebih dari satu fitur.
export const ORDER_STATUSES = ['Pesanan Dibuat', 'Sedang Diproses', 'Sedang Dikirim', 'Selesai'];
export const LAST_ORDER_STEP = ORDER_STATUSES.length - 1;
export const STATUS_SHIPPED = 'Sedang Dikirim';
export const STATUS_COMPLETED = 'Selesai';

export const BOUQUET_STYLES = ['Cute', 'Soft', 'Elegant', 'Cheerful'];

export const FLOWER_COLORS = [
  { name: 'Pink', hex: '#f2a7bb' },
  { name: 'Yellow', hex: '#f6cf5c' },
  { name: 'Purple', hex: '#b9a0d8' },
  { name: 'Orange', hex: '#f08a3c' },
  { name: 'Blue', hex: '#9db9e0' },
  { name: 'White', hex: '#fbf6ee' },
  { name: 'Red', hex: '#d85a6a' },
];

export const ESTIMATED_SHIPPING_COST = 15000;

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Terpopuler' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
];

export const COURIERS = [
  { id: 'JNE', name: 'JNE Reguler', cost: 15000, eta: '2–3 hari' },
  { id: 'JNT', name: 'J&T Express', cost: 18000, eta: '2 hari' },
  { id: 'GoSend', name: 'GoSend Instant', cost: 25000, eta: 'Hari ini' },
];

export const PAYMENT_METHODS = ['Transfer Bank', 'QRIS', 'Bayar di Tempat (COD)'];
