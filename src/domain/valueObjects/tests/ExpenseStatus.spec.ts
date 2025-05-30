import { describe, it, expect } from "vitest";
import { ExpenseStatus } from "../ExpenseStatus";

describe("ExpenseStatus", () => {
  it("creates a pending status", () => {
    const status = new ExpenseStatus("PENDING");
    expect(status.isPending()).toBe(true);
    expect(status.isApproved()).toBe(false);
    expect(status.isRejected()).toBe(false);
    expect(status.toValue()).toBe("PENDING");
  });

  it("creates an approved status", () => {
    const status = new ExpenseStatus("APPROVED");
    expect(status.isPending()).toBe(false);
    expect(status.isApproved()).toBe(true);
    expect(status.isRejected()).toBe(false);
    expect(status.toValue()).toBe("APPROVED");
  });

  it("creates a rejected status", () => {
    const status = new ExpenseStatus("REJECTED");
    expect(status.isPending()).toBe(false);
    expect(status.isApproved()).toBe(false);
    expect(status.isRejected()).toBe(true);
    expect(status.toValue()).toBe("REJECTED");
  });

  it("throws on invalid status", () => {
    const invalid = () => new ExpenseStatus("IN_REVIEW");
    expect(invalid).toThrowError(
      /Invalid status value for expense: \(IN_REVIEW\)/,
    );
  });

  it("throws on empty string", () => {
    const empty = () => new ExpenseStatus("");
    expect(empty).toThrowError(/Invalid status value for expense: \(\)/);
  });
});
