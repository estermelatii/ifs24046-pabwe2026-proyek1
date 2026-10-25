import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { Checkout } from "./Checkout.jsx";
import { Success } from "../orders/Success.jsx";
import { renderWithProviders, mockFetch, order, cartItem, lastCall, userState } from "../../test-utils.jsx";

const app = (
  <Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/sukses/:code" element={<Success />} />
  </Routes>
);
const withCart = { cart: { items: [cartItem()] } };
// Tanggal pengiriman harus berada dalam rentang yang diizinkan form (hari ini sampai 1 tahun ke depan).
const deliveryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

async function toStep2() {
  fill("Nama lengkap", "Ani"); fill("Nomor telepon", "081234567890"); fill("Email", "ani@mail.com");
  await userEvent.click(screen.getByRole("button", { name: "Lanjut ke Pengiriman" }));
}
async function toStep3() {
  fill("Alamat lengkap", "Jl. Mawar 1"); fill("Kota", "Balige"); fill("Tanggal pengiriman", deliveryDate);
  await userEvent.click(screen.getByLabelText(/GoSend Instant/));
  fill("Pesan kartu ucapan (opsional)", "Selamat ulang tahun");
  await userEvent.click(screen.getByRole("button", { name: "Lanjut ke Pembayaran" }));
}

describe("Checkout", () => {
  it("menolak nomor telepon yang formatnya salah", async () => {
    renderWithProviders(app, { route: "/checkout", preloadedState: { ...withCart, ...userState } });
    fill("Nomor telepon", "123");
    await userEvent.click(screen.getByRole("button", { name: "Lanjut ke Pengiriman" }));
    expect(screen.getByLabelText("Nomor telepon")).toBeInvalid();
    expect(screen.getByRole("heading", { name: "Informasi Pelanggan" })).toBeInTheDocument();
  });

  it("menampilkan pesan bila keranjang kosong", () => {
    renderWithProviders(app, { route: "/checkout" });
    expect(screen.getByText(/Keranjang kosong/)).toBeInTheDocument();
  });

  it("menyelesaikan tiga langkah dan membuat pesanan", async () => {
    const fn = mockFetch([["POST /api/orders", order()]]);
    const { store } = renderWithProviders(app, { route: "/checkout", preloadedState: withCart });
    expect(screen.getByText("Informasi Pelanggan")).toBeInTheDocument();
    await toStep2();
    expect(await screen.findByRole("heading", { name: "Pengiriman" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Kembali" }));
    expect(screen.getByText("Informasi Pelanggan")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Lanjut ke Pengiriman" }));
    await toStep3();
    expect(await screen.findByRole("heading", { name: "Pembayaran" })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("QRIS"));
    await userEvent.click(screen.getByRole("button", { name: "Bayar & Buat Pesanan" }));
    expect(await screen.findByText("Pesanan Berhasil!")).toBeInTheDocument();
    expect(screen.getByText("FG2026100001")).toBeInTheDocument();
    const body = JSON.parse(lastCall(fn, "POST /api/orders")[1].body);
    expect(body).toMatchObject({ courier: "GoSend", payment_method: "QRIS", customer_name: "Ani", items: [{ product_id: 1, quantity: 2, color: "Pink" }] });
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("menampilkan error dari server dan dapat mencoba lagi", async () => {
    mockFetch([["POST /api/orders", { error: "Stok tidak cukup" }, 400]]);
    renderWithProviders(app, { route: "/checkout", preloadedState: withCart });
    await toStep2();
    await toStep3();
    await userEvent.click(screen.getByLabelText("Bayar di Tempat (COD)"));
    await userEvent.click(await screen.findByRole("button", { name: "Bayar & Buat Pesanan" }));
    expect(await screen.findByText("Stok tidak cukup")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bayar & Buat Pesanan" })).toBeEnabled();
  });

  it("mengisi nama dan email dari akun yang masuk", () => {
    renderWithProviders(app, { route: "/checkout", preloadedState: { ...withCart, ...userState } });
    expect(screen.getByLabelText("Nama lengkap")).toHaveValue("Ani Lestari");
    expect(screen.getByLabelText("Email")).toHaveValue("ani@mail.com");
  });
});
