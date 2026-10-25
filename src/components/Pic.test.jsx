import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pic } from "./Pic.jsx";

describe("Pic", () => {
  it("memakai foto lalu kembali ke ilustrasi bila foto gagal dimuat", () => {
    const { container } = render(<Pic hex="#f2a7bb" seed={1} src="/foto/1-1.jpg" big />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("big", "photo");
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByLabelText(/Ilustrasi buket/)).toBeInTheDocument();
  });

  it("tanpa src memakai ilustrasi", () => {
    render(<Pic hex="#fff" seed={2} />);
    expect(screen.getByLabelText(/Ilustrasi buket/)).toBeInTheDocument();
  });
});
