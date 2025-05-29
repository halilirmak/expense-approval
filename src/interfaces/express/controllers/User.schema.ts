import { z } from "zod";

export interface CreateUserCommand {
  email: string;
  managerId?: string;
}

export const CreateUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    managerId: z.string().uuid().optional(),
  }),
});
