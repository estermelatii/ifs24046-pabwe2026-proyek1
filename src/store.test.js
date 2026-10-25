import { describe, it, expect } from "vitest";
import { makeStore, store } from "./store.js";
import cartReducer, { addItem, setQty, removeItem, clearCart, selectCount, selectSubtotal, loadCart } from "./features/cart/cartSlice.js";
import { authenticate, fetchMe, logout } from "./features/auth/authSlice.js";
import { mockFetch, product, cartItem } from "./test-utils.jsx";

const pink = { name: "Pink", hex: "#f2a7bb" };

describe("cartSlice", () => {
  it("addItem menambah item baru dan menjumlah item yang sama", () => {
    let s = cartReducer(undefined, addItem({ product: product(1), qty: 2, color: pink }));
    s = cartReducer(s, addItem({ product: product(1), color: pink }));
    s = cartReducer(s, addItem({ product: product(1), qty: 1, color: { name: "White", hex: "#fff" } }));
    expect(s.items).toHaveLength(2);
    expect(s.items[0].qty).toBe(3);
  });

  it("setQty tidak kurang dari 1, removeItem dan clearCart bekerja", () => {
    let s = { items: [cartItem()] };
    s = cartReducer(s, setQty({ key: "1|Pink", qty: 0 }));
    expect(s.items[0].qty).toBe(1);
    s = cartReducer(s, setQty({ key: "1|Pink", qty: 4 }));
    expect(s.items[0].qty).toBe(4);
    expect(cartReducer(s, removeItem("1|Pink")).items).toHaveLength(0);
    expect(cartReducer(s, clearCart()).items).toHaveLength(0);
  });

  it("selector menghitung jumlah dan subtotal", () => {
    const st = { cart: { items: [cartItem(), cartItem({ key: "2|Pink", id: 2, price: 50000, qty: 1 })] } };
    expect(selectCount(st)).toBe(3);
    expect(selectSubtotal(st)).toBe(250000);
  });

  it("loadCart membaca localStorage dan aman terhadap data rusak", () => {
    expect(loadCart()).toEqual([]);
    localStorage.setItem("fg-cart2", JSON.stringify([cartItem()]));
    expect(loadCart()).toHaveLength(1);
    localStorage.setItem("fg-cart2", "{rusak");
    expect(loadCart()).toEqual([]);
  });

  it("store utama menyimpan keranjang ke localStorage", () => {
    store.dispatch(addItem({ product: product(9), color: pink }));
    expect(JSON.parse(localStorage.getItem("fg-cart2"))[0].id).toBe(9);
  });
});

describe("authSlice", () => {
  const user = { id: 1, name: "Ani", email: "a@b.c" };

  it("authenticate menyimpan token dan user", async () => {
    mockFetch([["POST /api/auth/login", { token: "t1", user }]]);
    const s = makeStore();
    await s.dispatch(authenticate({ mode: "login", body: {} }));
    expect(s.getState().auth.user).toEqual(user);
    expect(localStorage.getItem("fg-token")).toBe("t1");
  });

  it("fetchMe mengisi user, dan menghapus token bila gagal", async () => {
    localStorage.setItem("fg-token", "t1");
    mockFetch([["GET /api/auth/me", user]]);
    const s = makeStore();
    await s.dispatch(fetchMe());
    expect(s.getState().auth.user).toEqual(user);

    mockFetch([["GET /api/auth/me", { error: "x" }, 401]]);
    const s2 = makeStore();
    await s2.dispatch(fetchMe());
    expect(s2.getState().auth.user).toBeNull();
    expect(localStorage.getItem("fg-token")).toBeNull();
  });

  it("logout menghapus token dan user", () => {
    localStorage.setItem("fg-token", "t1");
    const s = makeStore({ auth: { user } });
    s.dispatch(logout());
    expect(s.getState().auth.user).toBeNull();
    expect(localStorage.getItem("fg-token")).toBeNull();
  });
});
