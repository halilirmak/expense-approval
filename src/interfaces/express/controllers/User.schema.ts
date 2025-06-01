import { z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    managerId: z.string().uuid().optional(),
  }),
});
