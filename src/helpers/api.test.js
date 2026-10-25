import { describe, it, expect } from "vitest";
import { api, rupiah } from "./api.js";
import { mockFetch } from "../test-utils.jsx";

describe("helpers/api", () => {
  it("rupiah memformat angka", () => {
    expect(rupiah(35000)).toBe("Rp 35.000");
  });

  it("api mengirim body JSON dan token bila ada", async () => {
    localStorage.setItem("fg-token", "abc");
    const fn = mockFetch([["POST /api/x", { ok: 1 }]]);
    const data = await api("/api/x", { method: "POST", body: { a: 1 } });
    expect(data).toEqual({ ok: 1 });
    const [, opt] = fn.mock.calls[0];
    expect(opt.headers.Authorization).toBe("Bearer abc");
    expect(opt.body).toBe('{"a":1}');
  });

  it("api tanpa token dan tanpa body", async () => {
    const fn = mockFetch([["GET /api/y", []]]);
    await api("/api/y");
    const [, opt] = fn.mock.calls[0];
    expect(opt.headers.Authorization).toBeUndefined();
    expect(opt.body).toBeUndefined();
  });

  it("api melempar pesan error dari server atau pesan bawaan", async () => {
    mockFetch([["GET /api/e1", { error: "Gagal total" }, 400], ["GET /api/e2", {}, 500]]);
    await expect(api("/api/e1")).rejects.toThrow("Gagal total");
    await expect(api("/api/e2")).rejects.toThrow("Terjadi kesalahan");
  });
});
