import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Account } from "./Account.jsx";
import { renderWithProviders, mockFetch, product, list, order, userState } from "../../test-utils.jsx";

const user = { id: 1, name: "ani lestari", email: "ani@mail.com" };
const dash = [["GET /api/my/orders", [order(), order({ id: 2, code: "FG2026100002", status: "Selesai" })]], ["GET /api/products", list([product(1)])]];

describe("Account", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it("login berhasil menampilkan sambutan dan dasbor", async () => {
    mockFetch([["POST /api/auth/login", { token: "t", user }], ...dash]);
    renderWithProviders(<Account />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ani@mail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "rahasia1" } });
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByText("Selamat datang kembali,")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Halo, Ani/ })).toBeInTheDocument();
    expect(await screen.findByText("Total pesanan")).toBeInTheDocument();
    expect(await screen.findByText("FG2026100001")).toBeInTheDocument();
    expect(localStorage.getItem("fg-token")).toBe("t");
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("daftar akun baru memakai sambutan berbeda dan menutup otomatis", async () => {
    mockFetch([["POST /api/auth/register", { token: "t", user }], ...dash]);
    renderWithProviders(<Account />);
    await userEvent.click(screen.getByRole("button", { name: "Belum punya akun? Daftar" }));
    fireEvent.change(screen.getByLabelText("Nama"), { target: { value: "Ani Lestari" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ani@mail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "rahasia1" } });
    await userEvent.click(screen.getByRole("button", { name: "Buat akun" }));
    expect(await screen.findByText("Selamat datang,")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("menampilkan error login dan dapat kembali ke mode masuk", async () => {
    mockFetch([["POST /api/auth/login", { error: "Email atau password salah" }, 401]]);
    renderWithProviders(<Account />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "x@mail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "salah123" } });
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByText(/Email atau password salah/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Belum punya akun? Daftar" }));
    await userEvent.click(screen.getByRole("button", { name: "Sudah punya akun? Masuk" }));
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("dasbor menampilkan statistik dan dapat keluar", async () => {
    mockFetch(dash);
    const { store } = renderWithProviders(<Account />, { preloadedState: { auth: { user } } });
    expect(await screen.findByText("FG2026100001")).toBeInTheDocument();
    expect(screen.getByText("Pesanan berjalan")).toBeInTheDocument();
    localStorage.setItem("fg-token", "t");
    await userEvent.click(screen.getByRole("button", { name: "Keluar" }));
    expect(store.getState().auth.user).toBeNull();
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("dasbor tanpa pesanan menampilkan ajakan belanja", async () => {
    mockFetch([["GET /api/my/orders", []], ["GET /api/products", list([product(1)])]]);
    renderWithProviders(<Account />, { preloadedState: userState });
    expect(await screen.findByText(/belum punya pesanan/)).toBeInTheDocument();
  });

  it("dasbor tetap tampil bila pesanan gagal dimuat", async () => {
    mockFetch([["GET /api/my/orders", { error: "x" }, 500], ["GET /api/products", list([product(1)])]]);
    renderWithProviders(<Account />, { preloadedState: userState });
    expect(await screen.findByText(/belum punya pesanan/)).toBeInTheDocument();
  });

  it("sambutan ditutup lewat tombol Tutup", async () => {
    mockFetch([["POST /api/auth/login", { token: "t", user }], ...dash]);
    renderWithProviders(<Account />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ani@mail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "rahasia1" } });
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});








