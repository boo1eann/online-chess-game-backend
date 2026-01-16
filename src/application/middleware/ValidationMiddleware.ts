import { Request, Response, NextFunction } from 'express';
import z, { ZodType } from 'zod';

export class ValidationMiddleware {
	static validate(schema: ZodType) {
		return (req: Request, res: Response, next: NextFunction): void => {
			try {
				schema.parse(req.body);
				next();
			} catch (error) {
				if (error instanceof z.ZodError) {
					res.status(400).json({
						success: false,
						error: 'Validation failed',
						details: error.issues.map(issue => ({
							field: issue.path.join('.'),
							message: issue.message,
						})),
					});
					return;
				}
				next(error);
			}
		}
	}

	static validateQuery(schema: ZodType) {
		return (req: Request, res: Response, next: NextFunction): void => {
			try {
				schema.parse(req.query);
				next();
			} catch (error) {
				if (error instanceof z.ZodError) {
					res.status(400).json({
						success: false,
						error: 'Query validation failed',
						details: error.issues.map(issue => ({
							field: issue.path.join('.'),
							message: issue.message,
						})),
					});
					return;
				}
				next(error);
			}
		};
	}

	static validateParams(schema: ZodType) {
		return (req: Request, res: Response, next: NextFunction): void => {
			try {
				schema.parse(req.params);
				next();
			} catch (error) {
				if (error instanceof z.ZodError) {
					res.status(400).json({
						success: false,
						error: 'Parameter validation failed',
						details: error.issues.map(issue => ({
							field: issue.path.join('.'),
							message: issue.message,
						})),
					});
					return;
				}
				next(error);
			}
		};
	}
}