import { configureStore } from '@reduxjs/toolkit';
import cart, { loadCart } from './features/cart/cartSlice.js';
import auth from './features/auth/authSlice.js';

export const makeStore = (preloadedState) => configureStore({ reducer: { cart, auth }, preloadedState });

export const store = makeStore({ cart: { items: loadCart() } });
store.subscribe(() => {
  localStorage.setItem('fg-cart2', JSON.stringify(store.getState().cart.items));
});
