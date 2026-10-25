import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { Product } from "./Product.jsx";
import { renderWithProviders, mockFetch, product } from "../../test-utils.jsx";

const app = (
  <Routes>
    <Route path="/produk/:id" element={<Product />} />
    <Route path="/keranjang" element={<div>Halaman Keranjang</div>} />
  </Routes>
);
const reviews = [{ id: 1, name: "Rina", rating: 5, comment: "Bagus sekali" }];
const withProduct = (p) => mockFetch([["GET /api/products/1/reviews", reviews], ["GET /api/products/1", p]]);

describe("Product", () => {
  it("memilih foto, warna, jumlah, lalu menambah ke keranjang", async () => {
    withProduct(product(1, { photos: 3 }));
    const { store } = renderWithProviders(app, { route: "/produk/1" });
    expect(await screen.findByRole("heading", { name: "Buket 1" })).toBeInTheDocument();
    expect(screen.getByText("Stok Tersedia")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Foto 2" }));
    await userEvent.click(screen.getByRole("button", { name: "White" }));
    await userEvent.click(screen.getByRole("button", { name: "Tambah" }));
    await userEvent.click(screen.getByRole("button", { name: "Tambah" }));
    await userEvent.click(screen.getByRole("button", { name: "Kurangi" }));
    await userEvent.click(screen.getByRole("button", { name: "Kurangi" }));
    await userEvent.click(screen.getByRole("button", { name: "Kurangi" }));
    await userEvent.click(screen.getByRole("button", { name: "Tambah" }));
    await userEvent.click(screen.getByRole("button", { name: "Tambah ke Keranjang" }));
    expect(await screen.findByText("Halaman Keranjang")).toBeInTheDocument();
    expect(store.getState().cart.items[0]).toMatchObject({ id: 1, qty: 2, color: { name: "White" } });
  });

  it("jumlah dibatasi oleh stok", async () => {
    withProduct(product(1, { stock: 2 }));
    renderWithProviders(app, { route: "/produk/1" });
    await screen.findByRole("heading", { name: "Buket 1" });
    for (let i = 0; i < 4; i++) await userEvent.click(screen.getByRole("button", { name: "Tambah" }));
    expect(screen.getByText("2", { selector: ".qty span" })).toBeInTheDocument();
  });

  it("stok habis: jumlah tidak bisa diubah dan tidak bisa ditambah ke keranjang", async () => {
    withProduct(product(1, { stock: 0 }));
    renderWithProviders(app, { route: "/produk/1" });
    await screen.findByRole("heading", { name: "Buket 1" });
    expect(screen.getByText("Stok Habis")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tambah" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Kurangi" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tambah ke Keranjang" })).toBeDisabled();
    expect(screen.getByText("1", { selector: ".qty span" })).toBeInTheDocument();
  });

  it("berpindah tab deskripsi, informasi, dan ulasan", async () => {
    withProduct(product(1));
    renderWithProviders(app, { route: "/produk/1" });
    await screen.findByRole("heading", { name: "Buket 1" });
    await userEvent.click(screen.getByRole("button", { name: "Informasi Produk" }));
    expect(screen.getByText("Momen")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ulasan" }));
    expect(await screen.findByText("Bagus sekali")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Deskripsi" }));
    expect(screen.getByText(/dibuat secara handmade/)).toBeInTheDocument();
  });

  it("menandai stok habis dan menonaktifkan tombol", async () => {
    withProduct(product(1, { stock: 0 }));
    renderWithProviders(app, { route: "/produk/1" });
    expect(await screen.findByText("Stok Habis")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tambah ke Keranjang" })).toBeDisabled();
  });

  it("menampilkan pesan bila produk tidak ditemukan", async () => {
    mockFetch([]);
    renderWithProviders(app, { route: "/produk/1" });
    expect(await screen.findByText(/Pastikan API berjalan/)).toBeInTheDocument();
  });

  it("memakai satu foto bila jumlah foto tidak ada dan ulasan belum termuat", async () => {
    mockFetch([["GET /api/products/1/reviews", { error: "gagal" }, 500], ["GET /api/products/1", product(1, { photos: undefined })]]);
    renderWithProviders(app, { route: "/produk/1" });
    await screen.findByRole("heading", { name: "Buket 1" });
    expect(screen.queryByRole("button", { name: "Foto 2" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Ulasan" }));
    expect(screen.getByText("Memuat…")).toBeInTheDocument();
  });
});
