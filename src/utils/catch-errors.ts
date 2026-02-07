import { HTTPSTATUS } from "../config/http.config";
import { ErrorCode } from "../enums/error-code.enum";
import { AppError } from "./AppError";

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCode.ACCESS_UNAUTHORIZED,
    );
  }
}

export class ActiveGameExistsException extends AppError {
  constructor(
    message = "Player already has an active game",
    errorCode: ErrorCode = ErrorCode.ACTIVE_GAME_EXISTS,
  ) {
    super(message, HTTPSTATUS.CONFLICT, errorCode);
  }
}
