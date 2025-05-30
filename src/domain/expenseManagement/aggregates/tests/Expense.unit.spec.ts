import { describe, it, expect, beforeEach } from "vitest";
import { ExpenseAggregate } from "../Expense";
import { Expense } from "../../entities/Expense";
import { User } from "../../entities/User";
import { ApprovalAssignment } from "../../entities/ApprovalAssignment";
import {
  AssignmentStatus,
  Money,
  ExpenseStatus,
  Email,
} from "../../../valueObjects";

describe("ExpenseAggregate", () => {
  let user: User;
  let expense: Expense;
  let initialAssignments: ApprovalAssignment[];

  beforeEach(() => {
    user = new User("user-1", new Email("user1@t.com"), "manager-1");
    expense = new Expense(
      "exp-1",
      new Money("100"),
      new ExpenseStatus("PENDING"),
      "user-1",
    );
    initialAssignments = [];
  });

  it("can approve a new assignment", () => {
    const aggregate = new ExpenseAggregate(expense, initialAssignments, user);
    const status = new AssignmentStatus("APPROVED");

    const assignment = aggregate.approveAssignment(status);

    expect(assignment.getStatus().toValue()).toBe("APPROVED");
    expect(aggregate.getAssignments()).toHaveLength(1);
  });

  it("throws when approving a completed expense", () => {
    const completeExpense = new Expense(
      "exp-2",
      new Money("400"),
      new ExpenseStatus("APPROVED"),
      "user-1",
    );
    const aggregate = new ExpenseAggregate(completeExpense, [], user);

    expect(() =>
      aggregate.approveAssignment(new AssignmentStatus("APPROVED")),
    ).toThrowError("can not approve completed expense");
  });

  it("returns true if user is next approver", () => {
    const assignment = new ApprovalAssignment(
      "a1",
      "exp-1",
      "someone",
      new AssignmentStatus("PENDING"),
      "user-1",
    );
    const aggregate = new ExpenseAggregate(expense, [assignment], user);

    expect(aggregate.canUserApprove()).toBe(true);
  });

  it("returns false if user is not next approver", () => {
    const assignment = new ApprovalAssignment(
      "a2",
      "exp-1",
      "someone",
      new AssignmentStatus("PENDING"),
      "other-user",
    );
    const aggregate = new ExpenseAggregate(expense, [assignment], user);

    expect(aggregate.canUserApprove()).toBe(false);
  });

  it("rejects the expense if any assignment is rejected", () => {
    const rejectedAssignment = new ApprovalAssignment(
      "a3",
      "exp-1",
      "approver",
      new AssignmentStatus("REJECTED"),
    );
    const aggregate = new ExpenseAggregate(expense, [rejectedAssignment], user);

    const updated = aggregate.approveExpense();
    expect(updated.getStatus().toValue()).toBe("REJECTED");
  });

  it("approves the expense if all if everyone approves and  the top manager approves", () => {
    const managerlessUser = new User("user-2", new Email("test@test.com"));
    const exp = new Expense(
      "exp-3",
      new Money("200"),
      new ExpenseStatus("PENDING"),
      "user-2",
    );
    const aggregate = new ExpenseAggregate(exp, [], managerlessUser);

    const updated = aggregate.approveExpense();
    expect(updated.getStatus().toValue()).toBe("APPROVED");
  });

  it("throws if assignments are not complete and expense is not ready", () => {
    const assignment = new ApprovalAssignment(
      "a4",
      "exp-1",
      "approver",
      new AssignmentStatus("PENDING"),
    );
    const aggregate = new ExpenseAggregate(expense, [assignment], user);

    expect(() => aggregate.approveExpense()).toThrowError(
      "can not approve expense, assignments are not completed",
    );
  });
});
