import { describe, it, expect } from "vitest";
import { rupiah, getFirstName, capitalize } from "./format.js";

describe("helpers/format", () => {
  it("rupiah memformat angka", () => {
    expect(rupiah(35000)).toBe("Rp 35.000");
  });

  it("getFirstName mengambil kata pertama", () => {
    expect(getFirstName("Ani Lestari")).toBe("Ani");
  });

  it("capitalize mengubah huruf pertama menjadi kapital", () => {
    expect(capitalize("ani")).toBe("Ani");
  });
});
