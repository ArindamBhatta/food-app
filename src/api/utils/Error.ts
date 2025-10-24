// src/errors/CustomErrors.ts

export class ValidationError extends Error {
  public errors: string[];
  public statusCode: number = 400;

  constructor(message: string, errors: string[]) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export class BusinessLogicError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "BusinessLogicError";
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessLogicError);
    }
  }
}

export class DatabaseError extends Error {
  public statusCode: number = 500;

  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}

export class NotFoundError extends Error {
  public statusCode: number = 404;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class UnauthorizedError extends Error {
  public statusCode: number = 401;

  constructor(message: string = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}
