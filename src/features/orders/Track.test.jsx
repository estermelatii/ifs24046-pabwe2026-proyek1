import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { Track } from "./Track.jsx";
import { renderWithProviders, mockFetch, order, lastCall } from "../../test-utils.jsx";

const app = (
  <Routes>
    <Route path="/lacak" element={<Track />} />
    <Route path="/lacak/:code" element={<Track />} />
  </Routes>
);

describe("Track", () => {
  it("menampilkan linimasa dan memajukan status (demo)", async () => {
    const fn = mockFetch([["PATCH /api/orders/FG2026100001/status", {}], ["GET /api/orders/FG2026100001", order({ status: "Sedang Diproses" })]]);
    renderWithProviders(app, { route: "/lacak/FG2026100001" });
    expect(await screen.findByRole("heading", { name: "FG2026100001" })).toBeInTheDocument();
    expect(screen.getByText("Sedang Dikirim")).toBeInTheDocument();
    expect(screen.getByText("Rp 215.000")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Demo: majukan status/ }));
    expect(JSON.parse(lastCall(fn, "PATCH")[1].body)).toEqual({ status: "Sedang Dikirim" });
  });

  it("tidak menampilkan tombol demo bila sudah selesai", async () => {
    mockFetch([["GET /api/orders/FG2026100001", order({ status: "Selesai" })]]);
    renderWithProviders(app, { route: "/lacak/FG2026100001" });
    await screen.findByRole("heading", { name: "FG2026100001" });
    expect(screen.queryByRole("button", { name: /Demo/ })).toBeNull();
  });

  it("mencari pesanan lewat kode dan menampilkan error bila tidak ada", async () => {
    mockFetch([["GET /api/orders/FG1", order({ code: "FG1" })]]);
    renderWithProviders(app, { route: "/lacak" });
    expect(screen.queryByRole("heading", { name: "FG1" })).toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/FG2026100001/), { target: { value: " FG1 " } });
    await userEvent.click(screen.getByRole("button", { name: "Lacak" }));
    expect(await screen.findByRole("heading", { name: "FG1" })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/FG2026100001/), { target: { value: "SALAH" } });
    await userEvent.click(screen.getByRole("button", { name: "Lacak" }));
    expect(await screen.findByText("Tidak ditemukan")).toBeInTheDocument();
  });

  it("tidak mencari bila kode kosong", async () => {
    const fn = mockFetch([]);
    renderWithProviders(app, { route: "/lacak" });
    await userEvent.click(screen.getByRole("button", { name: "Lacak" }));
    expect(fn).not.toHaveBeenCalled();
  });
});
