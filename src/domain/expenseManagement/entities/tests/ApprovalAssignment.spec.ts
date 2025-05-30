import { describe, it, expect } from "vitest";
import { ApprovalAssignment } from "../ApprovalAssignment";
import { AssignmentStatus } from "../../../valueObjects";

describe("ApprovalAssignment Entity", () => {
  const id = "assign-1";
  const expenseId = "expense-1";
  const approverId = "approver-1";
  const nextApproverId = "approver-2";

  it("initializes correctly with APPROVED status", () => {
    const status = new AssignmentStatus("APPROVED");
    const assignment = new ApprovalAssignment(
      id,
      expenseId,
      approverId,
      status,
    );
    expect(assignment.getStatus().toValue()).toBe("APPROVED");
    expect(assignment.getId()).toBe(id);
    expect(assignment.getExpenseId()).toBe(expenseId);
    expect(assignment.getApproverId()).toBe(approverId);
  });

  it("approves the assignment", () => {
    const assignment = new ApprovalAssignment(
      id,
      expenseId,
      approverId,
      new AssignmentStatus("PENDING"),
    );

    assignment.approve(new AssignmentStatus("APPROVED"), approverId);

    expect(assignment.getStatus().isApproved()).toBe(true);
    expect(assignment.getStatus().toValue()).toBe("APPROVED");
  });

  it("rejects the assignment with reason", () => {
    const assignment = new ApprovalAssignment(
      id,
      expenseId,
      approverId,
      new AssignmentStatus("APPROVED"),
    );

    assignment.approve(
      new AssignmentStatus("REJECTED"),
      approverId,
      "Missing docs",
    );

    expect(assignment.getStatus().isRejected()).toBe(true);
    expect(assignment.getStatus().toValue()).toBe("REJECTED");
    expect(assignment.getApproverId()).toBe(approverId);
  });

  it("throws if rejecting without a reason", () => {
    const assignment = new ApprovalAssignment(
      id,
      expenseId,
      approverId,
      new AssignmentStatus("PENDING"),
    );

    expect(() => {
      assignment.approve(new AssignmentStatus("REJECTED"), approverId);
    }).toThrowError(/reason is required/);
  });

  it("serializes to JSON correctly", () => {
    const createdAt = new Date();
    const assignment = new ApprovalAssignment(
      id,
      expenseId,
      approverId,
      new AssignmentStatus("PENDING"),
      nextApproverId,
      "Awaiting docs",
      createdAt,
    );

    expect(assignment.toJSON()).toEqual({
      id,
      expenseId,
      approverId,
      nextApproverId,
      status: "PENDING",
      reason: "Awaiting docs",
      createdAt,
    });
  });
});
