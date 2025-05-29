import { IExpenseManagementUsecase } from "../../domain/expenseManagement/usecase.js";
import { INotificationAPI } from "../../infra/notify/Email.js";

import {
  ApproveAssignment,
  ApproveAssignmentResponse,
} from "../commands/expenseManagement.js";

import {
  IUserRepository,
  IExpenseRepository,
  IApprovalAssignmentRepository,
} from "../../domain/expenseManagement/repository.js";

export interface IExpenseManagementService {
  approve(command: ApproveAssignment): Promise<ApproveAssignmentResponse>;
}

export class ExpenseManagementService implements IExpenseManagementService {
  constructor(
    private usecase: IExpenseManagementUsecase,
    private notificationService: INotificationAPI,
    private userRepository: IUserRepository,
    private expenseRepository: IExpenseRepository,
    private approvalAssignmentRepository: IApprovalAssignmentRepository,
  ) {}

  async approve(
    command: ApproveAssignment,
  ): Promise<ApproveAssignmentResponse> {
    const user = await this.userRepository.getUser(command.userId);
    const { expense, assignments } = await this.expenseRepository.getExpense(
      command.expenseId,
    );

    const approval = this.usecase.approveAssignment({
      expense,
      assignments,
      user,
      approval: command.approval,
      reason: command.reason,
    });

    await this.approvalAssignmentRepository.create(
      approval.assignment.toJSON(),
    );

    if (approval.isComplete) {
      await this.expenseRepository.updateExpenseStatus(
        approval.expense.getId(),
        approval.expense.getStatus().toValue(),
      );
    }

    if (approval.nextApprover) {
      this.notificationService.notify(user.getEmail());
    }

    return {
      expense: approval.expense.toJSON(),
      assignment: approval.assignment.toJSON(),
      nextApprover: approval.nextApprover,
    };
  }
}
