import { Expense } from "./entities/Expense";
import { User } from "./entities/User";
import { ApprovalAssignment } from "./entities/ApprovalAssignment";
import { ExpenseAggregate } from "./aggregates/Expense";
import { AssignmentStatus } from "../valueObjects/index";

type ApproveExpenseProps = {
  expense: Expense;
  user: User;
  assignments: ApprovalAssignment[];
  approval: string;
  reason?: string;
};

type ApproveExpenseResult = {
  expense: Expense;
  assignment: ApprovalAssignment;
  isComplete: boolean;
  nextApprover?: string;
};

export interface IExpenseManagementUsecase {
  approveAssignment(params: ApproveExpenseProps): ApproveExpenseResult;
}

export class ExpenseManagementUsecase implements IExpenseManagementUsecase {
  approveAssignment(params: ApproveExpenseProps): ApproveExpenseResult {
    const aggregate = new ExpenseAggregate(
      params.expense,
      params.assignments,
      params.user,
    );
    const processedAssignment = aggregate.approveAssignment(
      new AssignmentStatus(params.approval),
      params.reason,
    );

    if (aggregate.isComplete()) {
      aggregate.approveExpense();
      return {
        expense: aggregate.getExpense(),
        assignment: processedAssignment,
        isComplete: true,
      };
    }

    return {
      expense: aggregate.getExpense(),
      assignment: processedAssignment,
      isComplete: false,
      nextApprover: aggregate.nextApprover(),
    };
  }
}
