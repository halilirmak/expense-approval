import { ProblemDetails } from "../../common/problemDetails";

type Status = "pending" | "approved" | "rejected";

export class ExpenseStatus {
  private readonly status: Status;

  constructor(value: string) {
    if (!["pending", "approved", "rejected"].includes(value)) {
      throw ProblemDetails.invalidInputError(
        `Invalid status value for expense: (${value})`,
      );
    }
    this.status = value as Status;
  }

  isPending() {
    return this.status === "pending";
  }

  isApproved() {
    return this.status === "approved";
  }

  isRejected() {
    return this.status === "rejected";
  }

  toValue() {
    return this.status;
  }
}
