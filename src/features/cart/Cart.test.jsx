import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "./Cart.jsx";
import { renderWithProviders, cartItem } from "../../test-utils.jsx";

describe("Cart", () => {
  it("menampilkan keranjang kosong", () => {
    renderWithProviders(<Cart />);
    expect(screen.getByText(/Keranjangmu masih kosong/)).toBeInTheDocument();
  });

  it("mengubah jumlah dan menghapus item", async () => {
    const { store } = renderWithProviders(<Cart />, { preloadedState: { cart: { items: [cartItem()] } } });
    expect(screen.getByText("1 item")).toBeInTheDocument();
    expect(screen.getAllByText("Rp 200.000").length).toBeGreaterThan(0);
    expect(screen.getByText("Rp 215.000")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tambah" }));
    expect(store.getState().cart.items[0].qty).toBe(3);
    await userEvent.click(screen.getByRole("button", { name: "Kurangi" }));
    expect(store.getState().cart.items[0].qty).toBe(2);
    await userEvent.click(screen.getByRole("button", { name: "Hapus" }));
    expect(screen.getByText(/Keranjangmu masih kosong/)).toBeInTheDocument();
  });
});
