import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Home } from "./Home.jsx";
import { renderWithProviders, mockFetch, product, list, cats, userState } from "../../test-utils.jsx";

const routes = [["GET /api/products", list([product(1), product(2)], { total: 34 })], ["GET /api/categories", cats]];

describe("Home", () => {
  it("menampilkan hero, buket unggulan, momen, dan cara pesan", async () => {
    mockFetch(routes);
    renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Little flowers/);
    expect(screen.getByText("FloraGift · Floral Atelier")).toBeInTheDocument();
    expect(await screen.findByText("Buket 1")).toBeInTheDocument();
    expect(await screen.findByText("Anniversary")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("menyapa pengguna yang sudah masuk", async () => {
    mockFetch(routes);
    renderWithProviders(<Home />, { preloadedState: userState });
    expect(screen.getByText("Selamat datang kembali, Ani")).toBeInTheDocument();
    await screen.findByText("Buket 1");
  });

  it("menampilkan pesan saat API gagal", async () => {
    mockFetch([]);
    renderWithProviders(<Home />);
    expect(await screen.findByText(/Pastikan API berjalan/)).toBeInTheDocument();
  });
});
