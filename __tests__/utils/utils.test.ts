import { isValidUrl, generateShortCode, parseUA } from "@/lib/utils";

describe("isValidUrl", () => {
  it("accepts a valid http URL", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("accepts a valid https URL with path and query", () => {
    expect(isValidUrl("https://example.com/path?utm_source=test")).toBe(true);
  });

  it("rejects a URL without a protocol", () => {
    expect(isValidUrl("example.com")).toBe(false);
  });

  it("rejects an ftp URL", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidUrl("")).toBe(false);
  });

  it("rejects plain text", () => {
    expect(isValidUrl("not a url at all")).toBe(false);
  });
});

describe("generateShortCode", () => {
  it("returns a string of length 7", () => {
    expect(generateShortCode()).toHaveLength(7);
  });

  it("returns only alphanumeric characters", () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[0-9A-Za-z]+$/);
  });

  it("generates unique codes across multiple calls", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateShortCode()));
    expect(codes.size).toBe(20);
  });
});

describe("parseUA", () => {
  it("detects Chrome on Windows as desktop", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    expect(parseUA(ua)).toEqual({ device: "desktop", os: "Windows", browser: "Chrome" });
  });

  it("detects Safari on iOS as mobile", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(parseUA(ua)).toEqual({ device: "mobile", os: "iOS", browser: "Safari" });
  });

  it("detects Firefox on Android as mobile", () => {
    const ua =
      "Mozilla/5.0 (Android 13; Mobile; rv:124.0) Gecko/124.0 Firefox/124.0";
    expect(parseUA(ua)).toEqual({ device: "mobile", os: "Android", browser: "Firefox" });
  });

  it("detects Edge on Windows", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0";
    expect(parseUA(ua)).toMatchObject({ browser: "Edge", os: "Windows" });
  });

  it("detects macOS desktop", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    expect(parseUA(ua)).toMatchObject({ device: "desktop", os: "macOS" });
  });

  it("returns Other for an unknown user agent", () => {
    expect(parseUA("")).toEqual({ device: "desktop", os: "Other", browser: "Other" });
  });
});
