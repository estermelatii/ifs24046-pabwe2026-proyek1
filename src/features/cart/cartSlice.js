import { createSlice } from '@reduxjs/toolkit';

export const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('fg-cart2')) || [];
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
      const found = state.items.find((i) => i.key === key);
      if (found) found.qty += qty;
      else state.items.push({ key, id: product.id, name: product.name, price: product.price, color, qty });
    },
    setQty(state, { payload: { key, qty } }) {
      const item = state.items.find((i) => i.key === key);
      item.qty = Math.max(1, qty);
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i.key !== payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export const selectCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectSubtotal = (s) => s.cart.items.reduce((n, i) => n + i.qty * i.price, 0);
export default cartSlice.reducer;
