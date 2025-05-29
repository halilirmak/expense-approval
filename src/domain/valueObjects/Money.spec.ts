import { describe, it, expect } from "vitest";
import { Money } from "./Money";

describe("Money", () => {
  it("should construct with valid amount format", () => {
    const m = new Money("123.45");
    expect(m.toString()).toBe("123.45");
  });

  it("should accept whole number with no decimals", () => {
    const m = new Money("500");
    expect(m.toString()).toBe("500");
  });

  it("should throw on invalid format", () => {
    expect(() => new Money("abc")).toThrowError();
    expect(() => new Money("12.3")).toThrowError();
    expect(() => new Money("12.")).toThrowError();
    expect(() => new Money(".99")).toThrowError();
  });

  it("should convert to cents correctly", () => {
    expect(new Money("123.45").toCent()).toBe(12345);
    expect(new Money("100").toCent()).toBe(10000);
    expect(new Money("0.99").toCent()).toBe(99);
  });

  it("should return string via toString", () => {
    const m = new Money("789.00");
    expect(m.toString()).toBe("789.00");
  });

  it("should format number to money string using static from()", () => {
    expect(Money.from(12345)).toBe("123.45");
    expect(Money.from(500)).toBe("5.00");
    expect(Money.from(0)).toBe("0.00");
  });
});
