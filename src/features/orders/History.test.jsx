import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { History } from "./History.jsx";
import { renderWithProviders, mockFetch, order, userState, lastCall } from "../../test-utils.jsx";

const app = (
  <Routes>
    <Route path="/riwayat" element={<History />} />
    <Route path="/keranjang" element={<div>Halaman Keranjang</div>} />
  </Routes>
);
const orders = [order({ status: "Sedang Dikirim" }), order({ id: 2, code: "FG2026100002", status: "Selesai" })];

describe("History", () => {
  it("menampilkan, memfilter, dan menerima pesanan", async () => {
    const fn = mockFetch([["POST /api/orders/FG2026100001/received", { status: "Selesai" }], ["GET /api/my/orders", orders]]);
    renderWithProviders(app, { route: "/riwayat", preloadedState: userState });
    expect(await screen.findByText("FG2026100001")).toBeInTheDocument();
    expect(screen.getByText("FG2026100002")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Received" }));
    expect(lastCall(fn, "POST /api/orders/FG2026100001/received")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Selesai" }));
    expect(screen.queryByText("FG2026100001")).toBeNull();
    expect(screen.getByText("FG2026100002")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Semua" }));
    expect(screen.getByText("FG2026100001")).toBeInTheDocument();
  });

  it("memesan ulang dan menyediakan tautan chat admin", async () => {
    mockFetch([["GET /api/my/orders", [orders[1]]]]);
    const { store } = renderWithProviders(app, { route: "/riwayat", preloadedState: userState });
    await screen.findByText("FG2026100002");
    expect(screen.getByRole("link", { name: "Chat Admin" })).toHaveAttribute("href", expect.stringContaining("wa.me/6282160183466"));
    expect(screen.queryByRole("button", { name: "Received" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Reordering" }));
    expect(await screen.findByText("Halaman Keranjang")).toBeInTheDocument();
    expect(store.getState().cart.items[0]).toMatchObject({ id: 1, qty: 2, color: { name: "Pink" } });
  });

  it("menampilkan pesan bila belum ada pesanan atau terjadi error", async () => {
    mockFetch([["GET /api/my/orders", []]]);
    const { unmount } = renderWithProviders(app, { route: "/riwayat", preloadedState: userState });
    expect(await screen.findByText(/Belum ada pesanan/)).toBeInTheDocument();
    unmount();
    mockFetch([["GET /api/my/orders", { error: "Silakan masuk dulu" }, 401]]);
    renderWithProviders(app, { route: "/riwayat", preloadedState: userState });
    expect(await screen.findByText("Silakan masuk dulu")).toBeInTheDocument();
  });
});
