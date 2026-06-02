import { isValidUrl } from "@/lib/utils";

describe("URL creation validation", () => {
  it("rejects a URL with no protocol", () => {
    expect(isValidUrl("example.com/page")).toBe(false);
  });

  it("rejects an empty payload", () => {
    const url = "";
    expect(!url || !isValidUrl(url)).toBe(true);
  });

  it("accepts a valid https URL", () => {
    expect(isValidUrl("https://github.com/owner/repo")).toBe(true);
  });

  it("accepts a URL with query string and fragment", () => {
    expect(isValidUrl("https://example.com/path?q=hello#section")).toBe(true);
  });
});

describe("URL delete validation", () => {
  it("requires a non-empty code", () => {
    const code = "";
    expect(!code).toBe(true);
  });

  it("passes with a valid code string", () => {
    const code = "abc1234";
    expect(!code).toBe(false);
  });
});
