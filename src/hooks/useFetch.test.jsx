import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch.js";

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

describe("useFetch", () => {
  it("mengembalikan data dan meneruskan parameter ke fetcher", async () => {
    const fetcher = async (id) => ({ id });
    const { result } = renderHook(() => useFetch(fetcher, 7));
    expect(result.current[0]).toBeNull();
    await waitFor(() => expect(result.current[0]).toEqual({ id: 7 }));
  });

  it("mengembalikan pesan error", async () => {
    const fetcher = async () => { throw new Error("Rusak"); };
    const { result } = renderHook(() => useFetch(fetcher));
    await waitFor(() => expect(result.current[1]).toBe("Rusak"));
  });

  it("mengabaikan respons sukses yang datang setelah unmount", async () => {
    const pending = deferred();
    const fetcher = () => pending.promise;
    const { result, unmount } = renderHook(() => useFetch(fetcher));
    unmount();
    pending.resolve({ late: true });
    await pending.promise;
    expect(result.current[0]).toBeNull();
  });

  it("mengabaikan error yang datang setelah unmount", async () => {
    const pending = deferred();
    const fetcher = () => pending.promise;
    const { result, unmount } = renderHook(() => useFetch(fetcher));
    unmount();
    pending.reject(new Error("terlambat"));
    await pending.promise.catch(() => {});
    expect(result.current[1]).toBe("");
  });
});
