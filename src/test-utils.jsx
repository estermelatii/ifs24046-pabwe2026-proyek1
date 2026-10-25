import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { makeStore } from "./store.js";

export function renderWithProviders(ui, { route = "/", preloadedState, store = makeStore(preloadedState) } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}

// routes: [[ "METHOD /path", body, status? ], ...] (cocok berdasarkan awalan, yang pertama menang)
export function mockFetch(routes = []) {
  const fn = vi.fn(async (url, opt = {}) => {
    const u = new URL(String(url));
    const key = `${opt.method || "GET"} ${u.pathname}${u.search}`;
    const hit = routes.find(([m]) => key.startsWith(m));
    if (!hit) return { ok: false, status: 404, json: async () => ({ error: "Tidak ditemukan" }) };
    const [, body, status = 200] = hit;
    return { ok: status < 400, status, json: async () => (typeof body === "function" ? body(opt) : body) };
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

export const lastCall = (fn, prefix) =>
  [...fn.mock.calls].reverse().find(([url, opt = {}]) => `${opt.method || "GET"} ${new URL(String(url)).pathname}`.startsWith(prefix));

export const cats = [
  { id: 1, name: "Birthday" }, { id: 2, name: "Graduation" }, { id: 3, name: "Anniversary" },
  { id: 4, name: "Appreciation" }, { id: 5, name: "Just Because" },
];

export const product = (id = 1, o = {}) => ({
  id, name: `Buket ${id}`, description: "Deskripsi buket", price: 100000, stock: 5, photos: 1, style: "Cute",
  colors: [{ name: "Pink", hex: "#f2a7bb" }, { name: "White", hex: "#fbf6ee" }],
  sold: 10, rating: 4.6, reviews_count: 3, category_id: 1, moment: "Birthday", ...o,
});

export const list = (items, o = {}) => ({ items, total: items.length, page: 1, pages: 1, ...o });

export const order = (o = {}) => ({
  id: 1, code: "FG2026100001", customer_name: "Ani", courier: "JNE", shipping_cost: 15000, total: 215000,
  status: "Pesanan Dibuat", created_at: "2026-10-24 10:00:00", delivery_date: "2026-11-01",
  items: [{ id: 1, product_id: 1, name: "Buket 1", color: "Pink", color_hex: "#f2a7bb", quantity: 2, price: 100000 }], ...o,
});

export const cartItem = (o = {}) => ({ key: "1|Pink", id: 1, name: "Buket 1", price: 100000, color: { name: "Pink", hex: "#f2a7bb" }, qty: 2, ...o });
export const userState = { auth: { user: { id: 1, name: "Ani Lestari", email: "ani@mail.com" } } };
