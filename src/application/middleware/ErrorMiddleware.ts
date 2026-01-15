import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
	statusCode?: number;
	isOperational?: boolean;
}

export class ErrorMiddleware {
	static handle(err: AppError, req: Request, res: Response, next: NextFunction): void {
		const statusCode = err.statusCode || 500;
		const isOperational = err.isOperational || false;

		console.error('Error:', {
			message: err.message,
			stack: err.stack,
			statusCode,
			isOperational,
			path: req.path,
			method: req.method,
		});

		if (process.env.NODE_ENV === 'production' && !isOperational) {
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
			return;
		}

		res.status(statusCode).json({
			success: false,
			error: err.message,
			...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
		});
	}

	static notFound(req: Request, res: Response): void {
		res.status(404).json({
			success: false,
			error: `Route ${req.originalUrl} not found`,
		});
	}
}