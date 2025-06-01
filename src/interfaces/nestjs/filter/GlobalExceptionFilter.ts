import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { HTTPError } from "../../../common/http_errors";
import { ILogger } from "../../../infra/logger";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: ILogger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(exception);
    const err = HTTPError.from(exception);

    response.status(err.statusCode).json(err.body);
  }
}
