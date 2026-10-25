import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { About } from "./About.jsx";
import { Contact } from "./Contact.jsx";
import { Success } from "../orders/Success.jsx";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders } from "../../test-utils.jsx";

describe("Halaman statis", () => {
  it("About menjelaskan FloraGift", () => {
    renderWithProviders(<About />);
    expect(screen.getByRole("heading", { name: "About FloraGift" })).toBeInTheDocument();
  });

  it("Contact memuat WhatsApp dan email", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole("link", { name: /Chat sekarang/ })).toHaveAttribute("href", "https://wa.me/6282160183466");
    expect(screen.getByRole("link", { name: /Kirim email/ })).toHaveAttribute("href", "mailto:manurungester477@gmail.com");
  });

  it("Success menampilkan Order ID dan tautan lacak", () => {
    renderWithProviders(<Routes><Route path="/sukses/:code" element={<Success />} /></Routes>, { route: "/sukses/FG2026100001" });
    expect(screen.getByText("FG2026100001")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lacak Pesanan" })).toHaveAttribute("href", "/lacak/FG2026100001");
  });
});
