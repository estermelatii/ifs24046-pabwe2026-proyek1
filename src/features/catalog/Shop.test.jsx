import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Shop } from "./Shop.jsx";
import { renderWithProviders, mockFetch, product, list, cats, lastCall } from "../../test-utils.jsx";

const routes = [["GET /api/categories", cats], ["GET /api/products", list([product(1), product(2)], { total: 2, pages: 3 })]];
const lastUrl = (fn) => String(fn.mock.calls.at(-1)[0]);

describe("Shop", () => {
  it("menampilkan produk, jumlah, dan pagination", async () => {
    const fn = mockFetch(routes);
    renderWithProviders(<Shop />, { route: "/toko" });
    expect(await screen.findByText("Buket 1")).toBeInTheDocument();
    expect(screen.getByText("2 buket")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(lastUrl(fn)).toContain("page=3");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("membaca parameter filter dari URL dan dapat mematikannya satu per satu", async () => {
    const fn = mockFetch(routes);
    renderWithProviders(<Shop />, { route: "/toko?q=rose&min=0&max=149999&color=Pink&style=Cute&moment=1&sort=price_asc&page=2" });
    await screen.findByText("Buket 1");
    expect(screen.getByText(/Hasil untuk “rose”/)).toBeInTheDocument();
    expect(screen.getByLabelText("Di bawah Rp150.000")).toBeChecked();
    expect(screen.getByLabelText("Cute")).toBeChecked();
    expect(screen.getByLabelText("Birthday")).toBeChecked();
    expect(screen.getByRole("button", { name: "Pink" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("combobox")).toHaveValue("price_asc");

    await userEvent.click(screen.getByLabelText("Di bawah Rp150.000"));
    expect(lastUrl(fn)).not.toContain("min=");
    await userEvent.click(screen.getByLabelText("Cute"));
    expect(lastUrl(fn)).not.toContain("style=");
    await userEvent.click(screen.getByLabelText("Birthday"));
    expect(lastUrl(fn)).not.toContain("moment=");
    await userEvent.click(screen.getByRole("button", { name: "Pink" }));
    expect(lastUrl(fn)).not.toContain("color=");
  });

  it("memilih filter harga, warna, gaya, momen, dan urutan", async () => {
    const fn = mockFetch(routes);
    renderWithProviders(<Shop />, { route: "/toko" });
    await screen.findByText("Buket 1");
    await userEvent.click(screen.getByLabelText("Rp150.000 – Rp200.000"));
    expect(lastUrl(fn)).toMatch(/min=150000.*max=200000|max=200000.*min=150000/);
    await userEvent.click(screen.getByRole("button", { name: "White" }));
    expect(lastUrl(fn)).toContain("color=White");
    await userEvent.click(screen.getByLabelText("Soft"));
    expect(lastUrl(fn)).toContain("style=Soft");
    await userEvent.click(screen.getByLabelText("Graduation"));
    expect(lastUrl(fn)).toContain("moment=2");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "price_desc" } });
    expect(lastUrl(fn)).toContain("sort=price_desc");
    await userEvent.click(screen.getByRole("button", { name: "Hapus semua filter" }));
    expect(lastUrl(fn)).not.toContain("style=");
    expect(lastCall(fn, "GET /api/products")).toBeTruthy();
  });

  it("menampilkan pesan bila tidak ada hasil", async () => {
    mockFetch([["GET /api/categories", cats], ["GET /api/products", list([], { total: 0 })]]);
    renderWithProviders(<Shop />, { route: "/toko" });
    expect(await screen.findByText(/Tidak ada buket yang cocok/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus semua filter" })).toBeNull();
  });
});
