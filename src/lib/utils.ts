import { customAlphabet } from "nanoid";

export function parseUA(ua: string): { device: string; os: string; browser: string } {
  const device = /ipad|tablet/i.test(ua)
    ? "tablet"
    : /mobile|android|iphone/i.test(ua)
    ? "mobile"
    : "desktop";

  const os = /iphone|ipad/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
    ? "Android"
    : /windows/i.test(ua)
    ? "Windows"
    : /mac os x|macintosh/i.test(ua)
    ? "macOS"
    : /linux/i.test(ua)
    ? "Linux"
    : "Other";

  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\//i.test(ua)
    ? "Opera"
    : /chrome/i.test(ua)
    ? "Chrome"
    : /firefox/i.test(ua)
    ? "Firefox"
    : /safari/i.test(ua)
    ? "Safari"
    : "Other";

  return { device, os, browser };
}

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const CODE_LENGTH = 7;

export function generateShortCode(): string {
  const generate = customAlphabet(ALPHABET, CODE_LENGTH);
  return generate();
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
