import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { JwtService } from "../../infrastructure/security/JwtService";
import { UnauthorizedException } from "../../utils/catch-errors";
import { ErrorCode } from "../../enums/error-code.enum";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  username?: string;
  email?: string;
}

@injectable()
export class AuthMiddleware {
  constructor(@inject(TYPES.JwtService) private jwtService: JwtService) {}

  authenticate() {
    return (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): void => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedException(
          "Access token missing",
          ErrorCode.ACCESS_TOKEN_MISSING,
        );
        return;
      }

      const token = authHeader.substring(7);

      try {
        const payload = this.jwtService.verifyAccessToken(token);
        req.userId = payload.userId;
        req.username = payload.username;
        req.email = payload.email;
        next();
      } catch (error) {
        throw new UnauthorizedException(
          "Access token expired",
          ErrorCode.ACCESS_TOKEN_EXPIRED,
        );
      }
    };
  }
}
