import { z } from "zod";

export const ApproveAssignmentSchema = z.object({
  body: z.object({
    expenseId: z.string().uuid(),
    approval: z.enum(["approved", "rejected"]),
    reason: z.string().optional(),
    userId: z.string().uuid(),
  }),
});

export interface CreateExpenseCommand {
  amount: string;
  submitterId: string;
}

export const CreateExpenseSchema = z.object({
  body: z.object({
    amount: z.string(),
    submittedId: z.string().uuid(),
  }),
});
