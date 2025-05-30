import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ExpenseManagementService,
  IExpenseManagementService,
} from "../ExpenseManagement";
import {
  ApproveAssignmentCommand,
  ApproveAssignmentResponse,
  CreateExpenseCommand,
} from "../../commands/expenseManagement";

describe("ExpenseManagementService", () => {
  let service: IExpenseManagementService;
  // Mocks
  const usecase = {
    approveAssignment: vi.fn(),
    createExpense: vi.fn(),
  };
  const notificationService = {
    notify: vi.fn(),
  };
  const userRepository = {
    getUser: vi.fn(),
    createUser: vi.fn(),
  };
  const expenseRepository = {
    getExpense: vi.fn(),
    create: vi.fn(),
    updateExpenseStatus: vi.fn(),
  };
  const approvalAssignmentRepository = {
    create: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ExpenseManagementService(
      usecase,
      notificationService,
      userRepository,
      expenseRepository,
      approvalAssignmentRepository,
    );
  });

  describe("approve", () => {
    it("should approve an assignment and notify next approver if present", async () => {
      const command: ApproveAssignmentCommand = {
        expenseId: "expense-1",
        userId: "user-1",
        approval: "approved",
      };

      const user = { getEmail: () => "user@example.com" };
      const expense = {
        getId: () => "expense-1",
        getStatus: () => ({ toValue: () => "approved" }),
        toJSON: () => ({ id: "expense-1" }),
      };
      const assignment = { toJSON: () => ({ id: "assignment-1" }) };
      const approval = {
        expense,
        assignment,
        isComplete: true,
        nextApprover: "next-user",
      };

      userRepository.getUser.mockResolvedValue(user);
      expenseRepository.getExpense.mockResolvedValue({
        expense,
        assignments: [],
      });
      usecase.approveAssignment.mockReturnValue(approval);
      approvalAssignmentRepository.create.mockResolvedValue(assignment);

      const result: ApproveAssignmentResponse = await service.approve(command);

      expect(userRepository.getUser).toHaveBeenCalledWith("user-1");
      expect(expenseRepository.getExpense).toHaveBeenCalledWith("expense-1");
      expect(usecase.approveAssignment).toHaveBeenCalledWith({
        expense,
        assignments: [],
        user,
        approval: "approved",
        reason: "Looks good",
      });
      expect(approvalAssignmentRepository.create).toHaveBeenCalledWith(
        assignment.toJSON(),
      );
      expect(expenseRepository.updateExpenseStatus).toHaveBeenCalledWith(
        "expense-1",
        "approved",
      );
      expect(notificationService.notify).toHaveBeenCalledWith(
        "user@example.com",
      );

      expect(result).toEqual({
        expense: approval.expense.toJSON(),
        assignment: approval.assignment.toJSON(),
        nextApprover: approval.nextApprover,
      });
    });

    it("should not notify if nextApprover is not present", async () => {
      const command: ApproveAssignmentCommand = {
        expenseId: "expense-2",
        userId: "user-2",
        approval: "rejected",
      };

      const user = { getEmail: () => "user2@example.com" };
      const expense = {
        getId: () => "expense-2",
        getStatus: () => ({ toValue: () => "rejected" }),
        toJSON: () => ({ id: "expense-2" }),
      };
      const assignment = { toJSON: () => ({ id: "assignment-2" }) };
      const approval = {
        expense,
        assignment,
        isComplete: true,
        nextApprover: undefined,
      };

      userRepository.getUser.mockResolvedValue(user);
      expenseRepository.getExpense.mockResolvedValue({
        expense,
        assignments: [],
      });
      usecase.approveAssignment.mockReturnValue(approval);
      approvalAssignmentRepository.create.mockResolvedValue(assignment);

      const result = await service.approve(command);

      expect(notificationService.notify).not.toHaveBeenCalled();
      expect(result.nextApprover).toBeUndefined();
    });
  });

  describe("createExpense", () => {
    it("should create expense and approval assignment and return id", async () => {
      const command: CreateExpenseCommand = {
        amount: "100",
        submitterId: "user-10",
      };

      const user = {
        /* user domain object */
      };
      const expense = {
        toJSON: () => ({ id: "expense-10" }),
        getId: () => "expense-10",
      };
      const assignment = {
        toJSON: () => ({ id: "assignment-10" }),
      };

      userRepository.getUser.mockResolvedValue(user);
      usecase.createExpense.mockReturnValue({ expense, assignment });
      expenseRepository.create.mockResolvedValue(expense);
      approvalAssignmentRepository.create.mockResolvedValue(assignment);

      const result = await service.createExpense(command);

      expect(userRepository.getUser).toHaveBeenCalledWith("user-10");
      expect(usecase.createExpense).toHaveBeenCalledWith({
        user,
        expense: {
          amount: "100",
          submitterId: "user-10",
        },
      });
      expect(expenseRepository.create).toHaveBeenCalledWith(expense.toJSON());
      expect(approvalAssignmentRepository.create).toHaveBeenCalledWith(
        assignment.toJSON(),
      );

      expect(result).toEqual({ id: "expense-10" });
    });
  });
});
