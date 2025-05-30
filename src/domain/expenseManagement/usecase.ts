import { v4 as uuid } from "uuid";
import { Expense } from "./entities/Expense";
import { User } from "./entities/User";
import { ApprovalAssignment } from "./entities/ApprovalAssignment";
import { ExpenseAggregate } from "./aggregates/Expense";
import { ProblemDetails } from "../../common/problemDetails";
import { ExpenseStatus, AssignmentStatus, Money } from "../valueObjects";

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

type CreateExpenseResult = {
  expense: Expense;
  assignment: ApprovalAssignment;
};

type CreateExpenseProps = {
  expense: {
    amount: string;
    submitterId: string;
  };
  user: User;
};
export interface IExpenseManagementUsecase {
  approveAssignment(params: ApproveExpenseProps): ApproveExpenseResult;
  createExpense(props: CreateExpenseProps): CreateExpenseResult;
}

export class ExpenseManagementUsecase implements IExpenseManagementUsecase {
  approveAssignment(params: ApproveExpenseProps): ApproveExpenseResult {
    const aggregate = new ExpenseAggregate(
      params.expense,
      params.assignments,
      params.user,
    );
    if (!aggregate.canUserApprove()) {
      throw ProblemDetails.unAuthorisedError(
        `user (${params.user.getUserId()}) does not have assignment`,
      );
    }
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

  createExpense(props: CreateExpenseProps): CreateExpenseResult {
    const expenseId = uuid();
    const assignmentId = uuid();
    const expense = new Expense(
      expenseId,
      new Money(props.expense.amount),
      new ExpenseStatus("PENDING"),
      props.expense.submitterId,
    );

    if (!props.user.isManaged()) {
      expense.approve();
      const assignment = new ApprovalAssignment(
        assignmentId,
        expenseId,
        props.user.getUserId(),
        new AssignmentStatus("APPROVED"),
      );

      return { expense, assignment };
    }

    const assignment = new ApprovalAssignment(
      assignmentId,
      expenseId,
      props.user.getUserId(),
      new AssignmentStatus("APPROVED"),
      props.user.getManagerId(),
    );

    return { expense, assignment };
  }
}
