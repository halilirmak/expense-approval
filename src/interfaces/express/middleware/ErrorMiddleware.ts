import { NextFunction, Request, Response } from "express";
import { ILogger } from "../../../infra/logger";
import { HTTPError } from "../../../common/http_errors";

export class ErrorMiddleware {
  constructor(private logger: ILogger) {}

  public customErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (err) {
      this.logger.error(err.message);
      const httpErr = HTTPError.from(err);
      res.status(httpErr.statusCode).json(httpErr.body);
    } else {
      next();
    }
  };
}
