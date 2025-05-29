import { ApprovalAssignment as PrismaApprovalAssignment } from "@prisma/client";
import { nullableToUndefined } from "./utils";
import { ApprovalAssignment } from "../../../../domain/expenseManagement/entities/ApprovalAssignment";
import { AssignmentStatus } from "../../../../domain/valueObjects/AssignmentStatus";

export class ApprovalAssignmentMapper {
  static toDomain(assignment: PrismaApprovalAssignment): ApprovalAssignment {
    return new ApprovalAssignment(
      assignment.id,
      assignment.expenseId,
      assignment.approverId,
      new AssignmentStatus(assignment.status),
      nullableToUndefined(assignment.reason),
      assignment.createdAt,
    );
  }

  static arrayToDomain(
    assignments: PrismaApprovalAssignment[],
  ): ApprovalAssignment[] {
    return assignments.map(
      (assignment) =>
        new ApprovalAssignment(
          assignment.id,
          assignment.expenseId,
          assignment.approverId,
          new AssignmentStatus(assignment.status),
          nullableToUndefined(assignment.reason),
          assignment.createdAt,
        ),
    );
  }
}
