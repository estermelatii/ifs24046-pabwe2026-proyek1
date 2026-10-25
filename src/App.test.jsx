import { describe, it, expect } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { renderWithProviders, mockFetch, product, list, cats, order, cartItem, userState } from "./test-utils.jsx";

const routes = () => [
  ["GET /api/auth/me", { id: 1, name: "Budi", email: "b@mail.com" }],
  ["GET /api/categories", cats],
  ["GET /api/my/orders", [order()]],
  ["GET /api/orders/FG2026100001", order()],
  ["GET /api/products/1/reviews", []],
  ["GET /api/products/1", product(1)],
  ["GET /api/products", list([product(1)])],
];

describe("App", () => {
  it("menampilkan navigasi dan beranda", async () => {
    mockFetch(routes());
    renderWithProviders(<App />);
    for (const t of ["Home", "Shop", "Find Your Bloom", "About", "Contact"]) expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    expect(await screen.findByText("Buket 1")).toBeInTheDocument();
    expect(document.querySelector(".bag b")).toBeNull();
  });

  it("menampilkan jumlah keranjang dan avatar pengguna", async () => {
    mockFetch(routes());
    renderWithProviders(<App />, { preloadedState: { ...userState, cart: { items: [cartItem()] } } });
    expect(document.querySelector(".bag b")).toHaveTextContent("2");
    expect(document.querySelector(".avatar")).toHaveTextContent("A");
    await screen.findByText("Buket 1");
  });

  it("memulihkan sesi dari token yang tersimpan", async () => {
    localStorage.setItem("fg-token", "t");
    mockFetch(routes());
    renderWithProviders(<App />);
    await screen.findByText("Buket 1");
    await screen.findByText("B", { selector: ".avatar" });
  });

  it("mengeluarkan pengguna saat sesi dinyatakan berakhir", async () => {
    localStorage.setItem("fg-token", "t");
    mockFetch(routes());
    renderWithProviders(<App />);
    await screen.findByText("B", { selector: ".avatar" });
    act(() => { window.dispatchEvent(new Event("auth:expired")); });
    expect(document.querySelector(".avatar")).toBeNull();
    expect(localStorage.getItem("fg-token")).toBeNull();
  });

  it("rute /riwayat dilindungi dan terbuka untuk pengguna yang sudah masuk", async () => {
    mockFetch(routes());
    renderWithProviders(<App />, { route: "/riwayat", preloadedState: userState });
    expect(await screen.findByText("FG2026100001")).toBeInTheDocument();
  });

  it("pencarian membuka halaman Shop", async () => {
    mockFetch(routes());
    renderWithProviders(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Cari" }));
    fireEvent.change(screen.getByPlaceholderText("Cari buket"), { target: { value: "rose" } });
    fireEvent.submit(screen.getByPlaceholderText("Cari buket").closest("form"));
    expect(await screen.findByText(/Hasil untuk “rose”/)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Cari buket")).toBeNull();
  });

  it.each([
    ["/toko", "Shop Our Bouquets"], ["/find", "Find Your Bloom"], ["/keranjang", "Keranjang Belanja"],
    ["/checkout", "Keranjang kosong."], ["/akun", "Masuk"], ["/about", "About FloraGift"], ["/kontak", "Hubungi Kami"],
    ["/lacak", "Lacak Pesanan"], ["/riwayat", "Riwayat Pesanan"], ["/sukses/FG1", "Pesanan Berhasil!"], ["/produk/1", "Buket 1"],
  ])("merender rute %s", async (route, text) => {
    mockFetch(routes());
    renderWithProviders(<App />, { route });
    expect((await screen.findAllByText(text, { exact: false })).length).toBeGreaterThan(0);
  });
});
