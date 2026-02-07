import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { HTTPSTATUS } from "../../config/http.config";

export class ErrorMiddleware {
  static handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any, Record<string, any>> {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message,
        errorCode: err.errorCode,
      });
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: err?.message || "Unknown error occured",
    });
  }

  static notFound(req: Request, res: Response): void {
    res.status(404).json({
      success: false,
      error: `Route ${req.originalUrl} not found`,
    });
  }
}
