import { IExpenseManagementUsecase } from "../../domain/expenseManagement/usecase";
import { INotificationAPI } from "../../infra/notify/Email";

import {
  ApproveAssignmentCommand,
  ApproveAssignmentResponse,
  CreateExpenseCommand,
} from "../commands/expenseManagement";

import {
  IUserRepository,
  IExpenseRepository,
  IApprovalAssignmentRepository,
} from "../../domain/expenseManagement/repository";

export interface IExpenseManagementService {
  approve(
    command: ApproveAssignmentCommand,
  ): Promise<ApproveAssignmentResponse>;
  createExpense(command: CreateExpenseCommand): Promise<{ id: string }>;
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
    command: ApproveAssignmentCommand,
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

  // Automatically approves first assignment from the user who created
  async createExpense(command: CreateExpenseCommand): Promise<{ id: string }> {
    const user = await this.userRepository.getUser(command.submitterId);
    const result = this.usecase.createExpense({
      user,
      expense: {
        amount: command.amount,
        submitterId: command.submitterId,
      },
    });

    const expense = await this.expenseRepository.create(
      result.expense.toJSON(),
    );

    await this.approvalAssignmentRepository.create(result.assignment.toJSON());
    return { id: expense.getId() };
  }
}
