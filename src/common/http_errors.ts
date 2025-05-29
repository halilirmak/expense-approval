import { ProblemDetails, isProblemDetails } from "./problemDetails";

type HttpErrorResponse = {
  statusCode: number;
  body: any;
};

export class HTTPError {
  static from(err: unknown): HttpErrorResponse {
    if (isProblemDetails(err)) {
      const e = err as ProblemDetails;
      switch (e.errorType) {
        case "invalid-input":
        case "invalid-request":
          return HTTPError.badRequest(e.message);
        case "not-found":
          return HTTPError.notFound(e.message);
        case "unauthorised-request":
          return HTTPError.unauthorised(e.message);
        default:
          return HTTPError.internalServerError(e.message);
      }
    }

    return HTTPError.internalServerError("Something unexpected happened");
  }

  static internalServerError(reason: string): HttpErrorResponse {
    return httpError(500, reason);
  }

  static badRequest(reason: string): HttpErrorResponse {
    return httpError(400, reason);
  }

  static notFound(reason: string): HttpErrorResponse {
    return httpError(404, reason);
  }
  static unauthorised(reason: string): HttpErrorResponse {
    return httpError(403, reason);
  }
}

const safeParse = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
};

function httpError(statusCode: number, reason: string) {
  const timestamp = new Date().toISOString();
  return {
    statusCode,
    body: {
      reason: safeParse(reason),
      timestamp,
    },
  };
}
