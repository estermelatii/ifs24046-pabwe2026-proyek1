import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../config.js';

export const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, { payload: { product, qty = 1, color } }) {
      const key = `${product.id}|${color.name}`;
      const existing = state.items.find((item) => item.key === key);
      if (existing) existing.qty += qty;
      else state.items.push({ key, id: product.id, name: product.name, price: product.price, color, qty });
    },
    setQty(state, { payload: { key, qty } }) {
      const item = state.items.find((item) => item.key === key);
      item.qty = Math.max(1, qty);
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((item) => item.key !== payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCount = (state) => state.cart.items.reduce((total, item) => total + item.qty, 0);
export const selectSubtotal = (state) => state.cart.items.reduce((total, item) => total + item.qty * item.price, 0);
export default cartSlice.reducer;
