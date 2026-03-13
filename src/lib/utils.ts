import { nanoid } from "nanoid";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const CODE_LENGTH = 7;

export function generateShortCode(): string {
  // nanoid v3 customAlphabet
  const { customAlphabet } = require("nanoid");
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
