import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard.jsx";
import { product } from "../test-utils.jsx";

describe("ProductCard", () => {
  it("menaut ke detail produk dan menampilkan harga", () => {
    render(<MemoryRouter><ProductCard product={product(7)} /></MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/produk/7");
    expect(screen.getByText("Rp 100.000")).toBeInTheDocument();
  });
});
