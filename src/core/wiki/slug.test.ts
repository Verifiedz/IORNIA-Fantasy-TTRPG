import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Kael Varros")).toBe("kael-varros");
  });

  it("strips punctuation", () => {
    expect(slugify("The Ashbrand Company!")).toBe("the-ashbrand-company");
  });

  it("collapses repeated separators and trims leading/trailing hyphens", () => {
    expect(slugify("  --Ember  Blade--  ")).toBe("ember-blade");
  });
});
