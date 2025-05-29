import { Request, Response } from "express";
import { IExpenseManagementService } from "../../../application/services/ExpenseManagement";
import { ApproveAssignmentSchema } from "./ExpensManagementSchemas";

export interface ApproveAssignment {
  expenseId: string;
  userId: string;
  approval: string;
  reason?: string;
}
export class ExpenseManagementController {
  constructor(private service: IExpenseManagementService) {}

  public approveAssigmentSchema = ApproveAssignmentSchema;

  async approveExpense(req: Request, res: Response): Promise<void> {
    const response = await this.service.approve({
      expenseId: req.body.expenseId,
      userId: req.body.userId,
      approval: req.body.approval,
      reason: req.body.reason,
    });

    res.json(response).status(201);
  }
}
