import { PrismaClient, AssignmentStatus } from "@prisma/client";
import {
  IApprovalAssignmentRepository,
  CreateApprovalAssignment,
} from "../../../domain/expenseManagement/repository";
import { ApprovalAssignmentMapper } from "./mapper/assignment";
import { ApprovalAssignment } from "~/domain/expenseManagement/entities/ApprovalAssignment";

export class PrismaApprovalAssignmentRepository
  implements IApprovalAssignmentRepository
{
  constructor(private db: PrismaClient) {}
  async create(params: CreateApprovalAssignment): Promise<ApprovalAssignment> {
    const assignment = await this.db.approvalAssignment.create({
      data: {
        expenseId: params.expenseId,
        reason: params.reason,
        approverId: params.approverId,
        status: params.status as AssignmentStatus,
      },
    });

    return ApprovalAssignmentMapper.toDomain(assignment);
  }
}
