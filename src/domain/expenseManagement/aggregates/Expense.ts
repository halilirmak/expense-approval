import { v4 as uuid } from "uuid";
import { Expense } from "../entities/Expense";
import { User } from "../entities/User";
import { ApprovalAssignment } from "../entities/ApprovalAssignment";
import { ProblemDetails } from "../../../common/problemDetails";
import { AssignmentStatus } from "../../valueObjects/";

export class ExpenseAggregate {
  constructor(
    private expense: Expense,
    private assignments: ApprovalAssignment[],
    private user: User,
  ) {}

  approveAssignment(status: AssignmentStatus, reason?: string) {
    if (this.expense.isComplete()) {
      throw ProblemDetails.invalidInputError(
        "can not approve completed expense",
      );
    }

    const assignment = new ApprovalAssignment(
      uuid(),
      this.expense.getId(),
      this.user.getUserId(),
      status,
    );

    assignment.approve(status, this.user.getUserId(), reason);

    this.assignments.push(assignment);
    return assignment;
  }

  nextApprover() {
    return this.user.getManagerId();
  }

  approveExpense() {
    if (!this.isComplete()) {
      throw ProblemDetails.invalidInputError(
        "can not approve expense, assignments are not completed",
      );
    }

    if (this.isAssignmentRejected()) {
      this.expense.reject();
      return this.expense;
    }

    this.expense.approve();
    return this.expense;
  }

  isAssignmentRejected() {
    return this.assignments.some((item) => item.getStatus().isRejected());
  }

  isComplete() {
    return !this.user.isManaged() || this.isAssignmentRejected();
  }

  getExpense() {
    return this.expense;
  }

  getAssignments() {
    return this.assignments;
  }
}
