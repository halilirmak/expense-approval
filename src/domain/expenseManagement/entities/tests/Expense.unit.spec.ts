import { describe, it, expect } from "vitest";
import { Expense } from "../Expense";
import { Money, ExpenseStatus } from "../../../valueObjects";

describe("Expense Entity", () => {
  const id = "exp123";
  const submitterId = "user456";

  it("initializes with default PENDING status", () => {
    const amount = new Money("100");
    const expense = new Expense(id, amount, undefined, submitterId);
    expect(expense.getStatus().toValue()).toBe("PENDING");
    expect(expense.isComplete()).toBe(false);
  });

  it("initializes with provided APPROVED status", () => {
    const amount = new Money("50");
    const status = new ExpenseStatus("APPROVED");
    const expense = new Expense(id, amount, status, submitterId);
    expect(expense.getStatus().toValue()).toBe("APPROVED");
    expect(expense.isComplete()).toBe(true);
  });

  it("approves the expense", () => {
    const amount = new Money("75");
    const expense = new Expense(id, amount, undefined, submitterId);
    expense.approve();
    expect(expense.getStatus().toValue()).toBe("APPROVED");
    expect(expense.isComplete()).toBe(true);
  });

  it("rejects the expense", () => {
    const amount = new Money("60");
    const expense = new Expense(id, amount, undefined, submitterId);
    expense.reject();
    expect(expense.getStatus().toValue()).toBe("REJECTED");
    expect(expense.isComplete()).toBe(true);
  });

  it("returns correct ID", () => {
    const amount = new Money("200");
    const expense = new Expense(id, amount, undefined, submitterId);
    expect(expense.getId()).toBe(id);
  });

  it("serializes to JSON correctly", () => {
    const amount = new Money("300");
    const now = new Date();
    const expense = new Expense(id, amount, undefined, submitterId, now, now);

    expect(expense.toJSON()).toEqual({
      id,
      amount: amount.toValue(),
      status: "PENDING",
      submitterId,
      createdAt: now,
      updatedAt: now,
    });
  });
});
