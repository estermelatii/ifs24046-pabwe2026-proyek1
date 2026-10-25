import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch.js";
import { mockFetch } from "../test-utils.jsx";

describe("useFetch", () => {
  it("mengembalikan data", async () => {
    mockFetch([["GET /api/a", { n: 1 }]]);
    const { result } = renderHook(() => useFetch("/api/a"));
    expect(result.current[0]).toBeNull();
    await waitFor(() => expect(result.current[0]).toEqual({ n: 1 }));
  });

  it("mengembalikan pesan error", async () => {
    mockFetch([["GET /api/a", { error: "Rusak" }, 500]]);
    const { result } = renderHook(() => useFetch("/api/a"));
    await waitFor(() => expect(result.current[1]).toBe("Rusak"));
  });
});
