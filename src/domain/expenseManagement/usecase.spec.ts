import { describe, it, expect, beforeEach } from "vitest";
import { ExpenseManagementUsecase } from "./usecase";
import { Expense } from "./entities/Expense";
import { User } from "./entities/User";
import { ApprovalAssignment } from "./entities/ApprovalAssignment";
import { AssignmentStatus, ExpenseStatus, Money, Email } from "../valueObjects";

describe("ExpenseManagementUsecase", () => {
  let usecase: ExpenseManagementUsecase;
  let managedUser: User;
  let unmanagedUser: User;

  beforeEach(() => {
    usecase = new ExpenseManagementUsecase();

    managedUser = new User("user-1", new Email("managed@t.com"), "manager-1");
    unmanagedUser = new User("user-2", new Email("unmanaged@t.com"));
  });

  describe("createExpense", () => {
    it("creates an expense with pending status and an assignment with next approver if user is managed", () => {
      const { expense, assignment } = usecase.createExpense({
        expense: { amount: "100", submitterId: managedUser.getUserId() },
        user: managedUser,
      });

      expect(expense.getStatus().toValue()).toBe("PENDING");
      expect(expense.getId()).toBeDefined();
      expect(assignment.getExpenseId()).toBe(expense.getId());
      expect(assignment.getStatus().toValue()).toBe("APPROVED");
      expect(assignment.getNextApproverId()).toBe(managedUser.getManagerId());
    });

    it("creates an approved expense immediately if user is unmanaged", () => {
      const { expense, assignment } = usecase.createExpense({
        expense: { amount: "200", submitterId: unmanagedUser.getUserId() },
        user: unmanagedUser,
      });

      expect(expense.getStatus().toValue()).toBe("APPROVED");
      expect(assignment.getNextApproverId()).toBeUndefined();
      expect(assignment.getStatus().toValue()).toBe("APPROVED");
    });
  });

  describe("approveAssignment", () => {
    let expense: Expense;
    let assignments: ApprovalAssignment[];

    beforeEach(() => {
      expense = new Expense(
        "expense-1",
        new Money("100"),
        new ExpenseStatus("PENDING"),
        managedUser.getUserId(),
      );
      assignments = [
        new ApprovalAssignment(
          "assignment-1",
          expense.getId(),
          "manager-1",
          new AssignmentStatus("APPROVED"),
          "manager-2",
        ),
      ];
    });

    it("throws if user does not have the assignment", () => {
      const otherUser = new User(
        "user-99",
        new Email("t@test.com"),
        "manager-99",
      );
      expect(() =>
        usecase.approveAssignment({
          expense,
          user: otherUser,
          assignments,
          approval: "APPROVED",
        }),
      ).toThrowError("user (user-99) does not have assignment");
    });

    it("approves an assignment and marks expense complete if all approved", () => {
      // Assignments should indicate nextApprover is current user to allow approval
      assignments[0] = new ApprovalAssignment(
        "assignment-1",
        expense.getId(),
        "previous-approver-id",
        new AssignmentStatus("APPROVED"),
        unmanagedUser.getUserId(),
      );

      const result = usecase.approveAssignment({
        expense,
        user: unmanagedUser,
        assignments,
        approval: "APPROVED",
      });

      expect(result.assignment.getStatus().toValue()).toBe("APPROVED");
      expect(result.isComplete).toBe(true);
      expect(result.expense.getStatus().toValue()).toMatch("APPROVED");
    });

    it("throws if reject reason is missing", () => {
      assignments[0] = new ApprovalAssignment(
        "assignment-1",
        expense.getId(),
        unmanagedUser.getUserId(),
        new AssignmentStatus("APPROVED"),
        managedUser.getUserId(),
      );

      expect(() =>
        usecase.approveAssignment({
          expense,
          user: managedUser,
          assignments,
          approval: "REJECTED",
        }),
      ).toThrowError("on reject reason is required");
    });
  });
});
