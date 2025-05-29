import { z } from "zod";

export const ApproveAssignmentSchema = z.object({
  body: z.object({
    expenseId: z.string().uuid(),
    approval: z.enum(["approved", "rejected"]),
    reason: z.string().optional(),
  }),
  headers: z.object({
    userId: z.string().uuid(),
  }),
});
