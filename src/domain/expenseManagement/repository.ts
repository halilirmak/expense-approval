import { ApprovalAssignment } from "./entities/ApprovalAssignment";
import { Expense } from "./entities/Expense";
import { User } from "./entities/User";

export type CreateExpense = {
  id?: string;
  amount: string;
  submitterId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateApprovalAssignment = {
  expenseId: string;
  reason?: string;
  approverId: string;
  nextApproverId?: string;
  status: string;
  createdAt?: Date;
};

export type CreateUser = {
  email: string;
  managerId?: string;
};

export interface IExpenseRepository {
  create(params: CreateExpense): Promise<Expense>;
  updateExpenseStatus(id: string, status: string): Promise<void>;
  getExpense(
    id: string,
  ): Promise<{ expense: Expense; assignments: ApprovalAssignment[] | [] }>;
}

export interface IUserRepository {
  getUser(id: string): Promise<User>;
  createUser(params: CreateUser): Promise<User>;
}

export interface IApprovalAssignmentRepository {
  create(params: CreateApprovalAssignment): Promise<ApprovalAssignment>;
}
