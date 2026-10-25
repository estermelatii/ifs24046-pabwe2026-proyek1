import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { RequireAuth } from "./RequireAuth.jsx";
import { renderWithProviders, userState } from "../test-utils.jsx";

const guarded = (
  <RequireAuth title="Halaman Rahasia" purpose="isinya">
    <p>Isi rahasia</p>
  </RequireAuth>
);

describe("RequireAuth", () => {
  it("meminta login bila belum masuk", () => {
    renderWithProviders(guarded);
    expect(screen.getByRole("heading", { name: "Halaman Rahasia" })).toBeInTheDocument();
    expect(screen.getByText(/Masuk dulu untuk melihat isinya/)).toBeInTheDocument();
    expect(screen.queryByText("Isi rahasia")).toBeNull();
  });

  it("menampilkan isi bila sudah masuk", () => {
    renderWithProviders(guarded, { preloadedState: userState });
    expect(screen.getByText("Isi rahasia")).toBeInTheDocument();
  });
});
