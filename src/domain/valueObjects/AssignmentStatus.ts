import { ProblemDetails } from "../../common/problemDetails";

type Status = "approved" | "rejected";

export class AssignmentStatus {
  private readonly status: Status;

  constructor(value: string) {
    if (!["approved", "rejected"].includes(value)) {
      throw ProblemDetails.invalidInputError(
        `Invalid status value for assignment: (${value})`,
      );
    }
    this.status = value as Status;
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
