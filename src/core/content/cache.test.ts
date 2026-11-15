import { describe, expect, it } from "vitest";
import { createContentCache } from "./cache";

describe("createContentCache", () => {
  it("stores and returns a successful parse", () => {
    const cache = createContentCache<{ title: string }>();

    const { value, error } = cache.update("a.md", {
      ok: true,
      value: { title: "First" },
    });

    expect(error).toBeNull();
    expect(value).toEqual({ title: "First" });
    expect(cache.get("a.md")).toEqual({ title: "First" });
  });

  it("keeps the last good value when a later parse fails", () => {
    const cache = createContentCache<{ title: string }>();

    cache.update("a.md", { ok: true, value: { title: "First" } });
    const { value, error } = cache.update("a.md", {
      ok: false,
      error: { file: "a.md", message: "boom" },
    });

    expect(error).toEqual({ file: "a.md", message: "boom" });
    expect(value).toEqual({ title: "First" });
    expect(cache.get("a.md")).toEqual({ title: "First" });
  });

  it("returns a null value with no prior good version", () => {
    const cache = createContentCache<{ title: string }>();

    const { value, error } = cache.update("a.md", {
      ok: false,
      error: { file: "a.md", message: "boom" },
    });

    expect(value).toBeNull();
    expect(error).toEqual({ file: "a.md", message: "boom" });
  });
});
