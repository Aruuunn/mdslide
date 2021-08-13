import { StatusCodes } from "http-status-codes";

export class UnAuthorizedException extends Error {
  public readonly code = StatusCodes.UNAUTHORIZED;
}

export class BadRequestException extends Error {
  public readonly code = StatusCodes.BAD_REQUEST;
}

export class InternalServerException extends Error {
  public readonly code = StatusCodes.INTERNAL_SERVER_ERROR;
}

export class NotFoundException extends Error {
  public readonly code = StatusCodes.NOT_FOUND;
}
