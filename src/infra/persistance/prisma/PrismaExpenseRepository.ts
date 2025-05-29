import {
  PrismaClient,
  Expense as PrismaExpense,
  ExpenseStatus,
} from "@prisma/client";
import {
  IExpenseRepository,
  CreateExpense,
} from "../../../domain/expenseManagement/repository";
import { Expense } from "../../../domain/expenseManagement/entities/Expense";
import { ApprovalAssignment } from "../../../domain/expenseManagement/entities/ApprovalAssignment";
import { ExpenseMapper } from "./mapper/expense";
import { ApprovalAssignmentMapper } from "./mapper/assignment";
import { ProblemDetails } from "../../../common/problemDetails";

export class PrismaExpenseRepository implements IExpenseRepository {
  constructor(private db: PrismaClient) {}

  async create(params: CreateExpense): Promise<Expense> {
    const expense = await this.db.expense.create({
      data: {
        amount: params.amount,
        status: params.status as ExpenseStatus,
        submitterId: params.submitterId,
      },
    });

    return ExpenseMapper.toDomain(expense);
  }

  async updateExpenseStatus(id: string, status: string): Promise<void> {
    await this.db.expense.update({
      where: {
        id,
      },
      data: {
        status: status as ExpenseStatus,
      },
    });
  }

  async getExpense(
    id: string,
  ): Promise<{ expense: Expense; assignments: ApprovalAssignment[] | [] }> {
    const data = await this.db.expense.findUnique({
      where: { id },
      include: {
        assignments: true,
      },
    });

    if (!data) {
      throw ProblemDetails.invalidInputError(`can not find expense (${id})`);
    }
    const expense: PrismaExpense = {
      id: data.id,
      amount: data.amount,
      status: data.status,
      submitterId: data.submitterId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    return {
      expense: ExpenseMapper.toDomain(expense),
      assignments: ApprovalAssignmentMapper.arrayToDomain(data.assignments),
    };
  }
}
