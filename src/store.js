import { configureStore } from '@reduxjs/toolkit';
import cart, { loadCart } from './features/cart/cartSlice.js';
import auth from './features/auth/authSlice.js';
import { STORAGE_KEYS } from './config.js';

export const makeStore = (preloadedState) => configureStore({ reducer: { cart, auth }, preloadedState });

export const store = makeStore({ cart: { items: loadCart() } });
store.subscribe(() => {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(store.getState().cart.items));
});
