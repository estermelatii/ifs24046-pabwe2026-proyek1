import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Find } from "./Find.jsx";
import { renderWithProviders, mockFetch, product, list, cats, lastCall } from "../../test-utils.jsx";

const pick = async (name) => userEvent.click(await screen.findByRole("button", { name }));

describe("Find", () => {
  it("menjalankan kuis sampai rekomendasi, lalu mengulang", async () => {
    const fn = mockFetch([["GET /api/categories", cats], ["GET /api/recommend", list([product(3)])]]);
    renderWithProviders(<Find />);
    expect(screen.getByText("Pertanyaan 1 dari 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Selanjutnya →" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Kembali" })).toBeDisabled();
    await pick("Birthday");
    await pick("Selanjutnya →");
    expect(screen.getByText("Pertanyaan 2 dari 3")).toBeInTheDocument();
    await pick("Kembali");
    expect(screen.getByText("Pertanyaan 1 dari 3")).toBeInTheDocument();
    await pick("Selanjutnya →");
    await pick("Cute");
    await pick("Selanjutnya →");
    await pick("Maks. Rp200.000");
    await pick("Lihat rekomendasi");
    expect(await screen.findByText("Rekomendasi untukmu")).toBeInTheDocument();
    expect(screen.getByText("Buket 3")).toBeInTheDocument();
    expect(String(lastCall(fn, "GET /api/recommend")[0])).toContain("style=Cute");
    await pick("Ulangi kuis");
    expect(screen.getByText("Pertanyaan 1 dari 3")).toBeInTheDocument();
  });

  it("menampilkan error bila rekomendasi gagal", async () => {
    mockFetch([["GET /api/categories", cats], ["GET /api/recommend", { error: "Gagal memuat" }, 500]]);
    renderWithProviders(<Find />);
    await pick("Birthday"); await pick("Selanjutnya →");
    await pick("Soft"); await pick("Selanjutnya →");
    await pick("Maks. Rp150.000"); await pick("Lihat rekomendasi");
    expect(await screen.findByText("Gagal memuat")).toBeInTheDocument();
  });
});
