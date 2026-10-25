import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Status, Stars, Pic, Card } from "./ui.jsx";
import { Ic } from "./Bouquet.jsx";
import { product } from "../test-utils.jsx";

describe("components/ui", () => {
  it("Status menampilkan error, memuat, dan isi", () => {
    const { rerender } = render(<Status data={null} error="Gagal">x</Status>);
    expect(screen.getByText(/Gagal/)).toBeInTheDocument();
    rerender(<Status data={null} error="">x</Status>);
    expect(screen.getByText("Memuat…")).toBeInTheDocument();
    rerender(<Status data={{}} error=""><p>Isi</p></Status>);
    expect(screen.getByText("Isi")).toBeInTheDocument();
  });

  it("Stars membulatkan rating", () => {
    render(<Stars v={4.6} />);
    expect(screen.getByLabelText("Rating 4.6")).toHaveTextContent("★★★★★");
  });

  it("Pic memakai foto lalu kembali ke ilustrasi bila foto gagal dimuat", () => {
    const { container } = render(<Pic hex="#f2a7bb" seed={1} src="/foto/1-1.jpg" big />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("big", "photo");
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("img", { name: /Ilustrasi buket/ })).toBeInTheDocument();
  });

  it("Pic tanpa src memakai ilustrasi", () => {
    render(<Pic hex="#fff" seed={2} />);
    expect(screen.getByRole("img", { name: /Ilustrasi buket/ })).toBeInTheDocument();
  });

  it("Card menaut ke detail produk", () => {
    render(<MemoryRouter><Card p={product(7)} /></MemoryRouter>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/produk/7");
    expect(screen.getByText("Rp 100.000")).toBeInTheDocument();
  });

  it("Ic merender ikon", () => {
    const { container } = render(<Ic n="bag" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
