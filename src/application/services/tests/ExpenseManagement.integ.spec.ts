import { beforeAll, describe, it, expect } from "vitest";
import { prismaClient } from "../../../../test/setupIntegration";

import { ExpenseManagementService } from "../ExpenseManagement";
import { User } from "../../../domain/expenseManagement/entities/User";
import {
  IUserRepository,
  IExpenseRepository,
  IApprovalAssignmentRepository,
  CreateExpense,
} from "../../../domain/expenseManagement/repository";
import {
  ApproveAssignmentCommand,
  CreateExpenseCommand,
} from "../../commands/expenseManagement";
import {
  PrismaUserRepository,
  PrismaExpenseRepository,
  PrismaApprovalAssignmentRepository,
} from "../../../infra/persistance/prisma";
import {
  IExpenseManagementUsecase,
  ExpenseManagementUsecase,
} from "../../../domain/expenseManagement/usecase";
import {
  INotificationAPI,
  EmailNotification,
} from "../../../infra/notify/Email";

let userRepository: IUserRepository;
let expenseRepository: IExpenseRepository;
let approvalAssignmentRepository: IApprovalAssignmentRepository;
let expenseManagementService: ExpenseManagementService;
let usecase: IExpenseManagementUsecase;
let notifier: INotificationAPI;

let unmanagedUser: User;
let manager: User;
let midManager: User;
let employee: User;

beforeAll(async () => {
  userRepository = new PrismaUserRepository(prismaClient);
  expenseRepository = new PrismaExpenseRepository(prismaClient);
  approvalAssignmentRepository = new PrismaApprovalAssignmentRepository(
    prismaClient,
  );
  usecase = new ExpenseManagementUsecase();
  notifier = new EmailNotification();

  expenseManagementService = new ExpenseManagementService(
    usecase,
    notifier,
    userRepository,
    expenseRepository,
    approvalAssignmentRepository,
  );

  unmanagedUser = await userRepository.createUser({
    email: "unmanaged@test.com",
  });

  manager = await userRepository.createUser({ email: "manager@t.com" });
  midManager = await userRepository.createUser({
    email: "employe@t.com",
    managerId: manager.getUserId(),
  });
  employee = await userRepository.createUser({
    email: "employe@t.com",
    managerId: midManager.getUserId(),
  });
});

describe("CreateExpense Integration", () => {
  it("creates expense for unmanaged user and approves expense, shoud have 1 approved assignment", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: unmanagedUser.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("APPROVED");

    const assignment = await prismaClient.approvalAssignment.findFirst({
      where: { expenseId: result.id },
    });
    expect(assignment?.approverId).toBe(unmanagedUser.getUserId());
    expect(assignment?.status).toBe("APPROVED");
  });

  it("creates expense for managed user and expense status to be expected PENDING", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: employee.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("PENDING");
  });

  it("should remain expense status to PENDING after midManager approval and assign next approver as manager", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: employee.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("PENDING");
    const approveCommand: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: midManager.getUserId(),
      approval: "APPROVED",
    };
    const approval = await expenseManagementService.approve(approveCommand);

    expect(approval.expense.status).toBe("PENDING");
    expect(approval.assignment.status).toBe("APPROVED");
    expect(approval.nextApprover).toBe(manager.getUserId());
  });
  it("should expense status to REJECTED after midManager rejects and no need for nextApprover", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: employee.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("PENDING");
    const approveCommand: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: midManager.getUserId(),
      approval: "REJECTED",
      reason: "unnecessery spending",
    };
    const approval = await expenseManagementService.approve(approveCommand);

    expect(approval.expense.status).toBe("REJECTED");
    expect(approval.assignment.status).toBe("REJECTED");
    expect(approval.nextApprover).toBeFalsy();
  });

  it("should expense status to be APPROVED after manager APPROVES and no need for nextApprover", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: employee.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("PENDING");
    const approveCommand: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: midManager.getUserId(),
      approval: "APPROVED",
      reason: "unnecessery spending",
    };
    const approval1 = await expenseManagementService.approve(approveCommand);

    expect(approval1.expense.status).toBe("PENDING");
    expect(approval1.assignment.status).toBe("APPROVED");
    expect(approval1.nextApprover).toBe(manager.getUserId());

    const approveCommand2: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: manager.getUserId(),
      approval: "APPROVED",
    };
    const approval2 = await expenseManagementService.approve(approveCommand2);
    expect(approval2.expense.status).toBe("APPROVED");
    expect(approval2.assignment.status).toBe("APPROVED");
    expect(approval2.nextApprover).toBeFalsy();
  });

  it("should throw error if someone tries to approve without being in management chain", async () => {
    const command: CreateExpenseCommand = {
      amount: "500.00",
      submitterId: employee.getUserId(),
    };

    const result = await expenseManagementService.createExpense(command);

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");

    const expense = await prismaClient.expense.findUnique({
      where: { id: result.id },
    });

    expect(expense).not.toBeNull();
    expect(expense?.status).toBe("PENDING");

    const approveCommand: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: midManager.getUserId(),
      approval: "APPROVED",
      reason: "unnecessary spending",
    };

    const approval1 = await expenseManagementService.approve(approveCommand);

    expect(approval1.expense.status).toBe("PENDING");
    expect(approval1.assignment.status).toBe("APPROVED");
    expect(approval1.nextApprover).toBe(manager.getUserId());

    const approveCommand2: ApproveAssignmentCommand = {
      expenseId: result.id,
      userId: unmanagedUser.getUserId(), // not in management chain
      approval: "APPROVED",
    };

    await expect(
      expenseManagementService.approve(approveCommand2),
    ).rejects.toThrow(/does not have assignment/);
  });
});
