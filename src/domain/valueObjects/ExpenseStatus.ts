import { ProblemDetails } from "../../common/problemDetails";

type Status = "PENDING" | "APPROVED" | "REJECTED";

export class ExpenseStatus {
  private readonly status: Status;

  constructor(value: string) {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(value)) {
      throw ProblemDetails.invalidInputError(
        `Invalid status value for expense: (${value})`,
      );
    }
    this.status = value as Status;
  }

  isPending() {
    return this.status === "PENDING";
  }

  isApproved() {
    return this.status === "APPROVED";
  }

  isRejected() {
    return this.status === "REJECTED";
  }

  toValue() {
    return this.status;
  }
}
