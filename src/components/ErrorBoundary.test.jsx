import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary.jsx";

let shouldCrash = true;
const Crashy = () => {
  if (shouldCrash) throw new Error("meledak");
  return <p>Pulih</p>;
};

describe("ErrorBoundary", () => {
  it("menampilkan pesan error lalu pulih saat dicoba lagi", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    shouldCrash = true;
    render(<ErrorBoundary><Crashy /></ErrorBoundary>);
    expect(screen.getByText("Terjadi kesalahan")).toBeInTheDocument();
    expect(logged).toHaveBeenCalled();

    shouldCrash = false;
    await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
    expect(screen.getByText("Pulih")).toBeInTheDocument();
  });

  it("merender anak bila tidak ada error", () => {
    render(<ErrorBoundary><p>Normal</p></ErrorBoundary>);
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });
});
