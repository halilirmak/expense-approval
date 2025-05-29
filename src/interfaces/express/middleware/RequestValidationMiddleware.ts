import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ProblemDetails } from "../../..//common/problemDetails";

export const requestValidator =
  <T>(schema?: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schema) {
      const result = schema.safeParse(req);
      if (!result.success) {
        throw ProblemDetails.invalidInputError(result.error.message);
      }
    }

    next();
  };
