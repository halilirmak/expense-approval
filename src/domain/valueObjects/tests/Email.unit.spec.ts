import { describe, it, expect } from "vitest";
import { Email } from "../Email";

describe("Email", () => {
  it("creates a valid email", () => {
    const email = new Email("user@example.com");
    expect(email.toValue()).toBe("user@example.com");
  });

  it("creates via static from()", () => {
    const email = Email.from("test@domain.com");
    expect(email.toValue()).toBe("test@domain.com");
  });

  it("throws on invalid email format", () => {
    const createInvalid = () => new Email("not-an-email");
    expect(createInvalid).toThrowError(
      /Email is not in correct format: not-an-email/,
    );
  });

  it("throws on empty email", () => {
    const createEmpty = () => new Email("");
    expect(createEmpty).toThrowError(/Email is not in correct format: /);
  });
});
