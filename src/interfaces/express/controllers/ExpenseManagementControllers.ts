import { Request, Response } from "express";
import { IExpenseManagementService } from "../../../application/services/ExpenseManagement";
import {
  ApproveAssignmentSchema,
  CreateExpenseSchema,
} from "./ExpensManagement.schema";

export class ExpenseManagementController {
  constructor(private expenseService: IExpenseManagementService) {}

  public approveAssigmentSchema = ApproveAssignmentSchema;

  async approveExpense(req: Request, res: Response): Promise<void> {
    const response = await this.expenseService.approve({
      expenseId: req.params.id,
      userId: req.body.userId,
      approval: req.body.approval,
      reason: req.body.reason,
    });

    res.json(response).status(200);
  }

  public createExpenseSchema = CreateExpenseSchema;

  async createExpense(req: Request, res: Response): Promise<void> {
    const response = await this.expenseService.createExpense({
      amount: req.body.amount,
      submitterId: req.body.submitterId,
    });
    res.json(response).status(201);
  }
}
