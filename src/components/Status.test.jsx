import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Status } from "./Status.jsx";

describe("Status", () => {
  it("menampilkan error, memuat, dan isi", () => {
    const { rerender } = render(<Status data={null} error="Gagal">x</Status>);
    expect(screen.getByText(/Gagal/)).toBeInTheDocument();
    rerender(<Status data={null} error="">x</Status>);
    expect(screen.getByText("Memuat…")).toBeInTheDocument();
    rerender(<Status data={{}} error=""><p>Isi</p></Status>);
    expect(screen.getByText("Isi")).toBeInTheDocument();
  });
});
