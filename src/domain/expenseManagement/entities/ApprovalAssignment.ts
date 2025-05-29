import { ProblemDetails } from "../../../common/problemDetails";
import { AssignmentStatus } from "../../valueObjects/";

export class ApprovalAssignment {
  constructor(
    private id: string,
    private expenseId: string,
    private approverId: string,
    private status: AssignmentStatus,
    private reason?: string,
    private createdAt?: Date,
  ) {}

  approve(status: AssignmentStatus, approverId: string, reason?: string) {
    if (status.isApproved()) {
      this.status = new AssignmentStatus("APPROVED");
      return;
    }

    if (!reason) {
      throw ProblemDetails.invalidInputError("on reject reason is required");
    }
    this.status = new AssignmentStatus("REJECTED");
    this.reason = reason;
    this.approverId = approverId;
  }

  getStatus() {
    return this.status;
  }

  getApproverId() {
    return this.approverId;
  }

  getId() {
    return this.id;
  }

  getExpenseId() {
    return this.expenseId;
  }

  toJSON() {
    return {
      id: this.id,
      expenseId: this.expenseId,
      approverId: this.approverId,
      status: this.status.toValue(),
      reason: this.reason,
      createdAt: this.createdAt,
    };
  }
}
