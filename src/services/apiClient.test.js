import { describe, it, expect, vi } from "vitest";
import { api } from "./apiClient.js";
import { mockFetch } from "../test-utils.jsx";

describe("services/apiClient", () => {
  it("mengirim body JSON dan token bila ada", async () => {
    localStorage.setItem("fg-token", "abc");
    const fn = mockFetch([["POST /api/x", { ok: 1 }]]);
    const data = await api("/api/x", { method: "POST", body: { a: 1 } });
    expect(data).toEqual({ ok: 1 });
    const [, opt] = fn.mock.calls[0];
    expect(opt.headers.Authorization).toBe("Bearer abc");
    expect(opt.body).toBe('{"a":1}');
  });

  it("tanpa token dan tanpa body", async () => {
    const fn = mockFetch([["GET /api/y", []]]);
    await api("/api/y");
    const [, opt] = fn.mock.calls[0];
    expect(opt.headers.Authorization).toBeUndefined();
    expect(opt.body).toBeUndefined();
  });

  it("melempar pesan error dari server atau pesan bawaan", async () => {
    mockFetch([["GET /api/e1", { error: "Gagal total" }, 400], ["GET /api/e2", {}, 500]]);
    await expect(api("/api/e1")).rejects.toThrow("Gagal total");
    await expect(api("/api/e2")).rejects.toThrow("Terjadi kesalahan");
  });

  it("memberi sinyal sesi berakhir saat token ditolak server (401)", async () => {
    localStorage.setItem("fg-token", "basi");
    mockFetch([["GET /api/private", { error: "Belum masuk" }, 401]]);
    const listener = vi.fn();
    window.addEventListener("auth:expired", listener);
    await expect(api("/api/private")).rejects.toThrow("Belum masuk");
    window.removeEventListener("auth:expired", listener);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("tidak memberi sinyal bila 401 terjadi tanpa token", async () => {
    mockFetch([["GET /api/private", { error: "Belum masuk" }, 401]]);
    const listener = vi.fn();
    window.addEventListener("auth:expired", listener);
    await expect(api("/api/private")).rejects.toThrow("Belum masuk");
    window.removeEventListener("auth:expired", listener);
    expect(listener).not.toHaveBeenCalled();
  });
});
