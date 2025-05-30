import { ProblemDetails } from "../../common/problemDetails";

type Status = "APPROVED" | "REJECTED" | "PENDING";

export class AssignmentStatus {
  private readonly status: Status;

  constructor(value: string) {
    if (!["APPROVED", "REJECTED", "PENDING"].includes(value)) {
      throw ProblemDetails.invalidInputError(
        `Invalid status value for assignment: (${value})`,
      );
    }
    this.status = value as Status;
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
