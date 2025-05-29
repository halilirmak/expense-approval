import { z } from "zod";

export const ApproveAssignmentSchema = z.object({
  body: z.object({
    approval: z.enum(["APPROVED", "REJECTED"]),
    reason: z.string().optional(),
    userId: z.string().uuid(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export interface CreateExpenseCommand {
  amount: string;
  submitterId: string;
}

export const CreateExpenseSchema = z.object({
  body: z.object({
    amount: z.string(),
    submitterId: z.string().uuid(),
  }),
});
