import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { JwtService } from '../../infrastructure/security/JwtService';

export interface AuthenticatedRequest extends Request {
	userId?: string;
	username?: string;
	email?: string;
}

@injectable()
export class AuthMiddleware {
	constructor(@inject(TYPES.JwtService) private jwtService: JwtService) { }

	authenticate() {
		return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				res.status(401).json({
					success: false,
					error: 'No token provided',
				});
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
				res.status(401).json({
					success: false,
					error: 'Invalid or expired token',
				});
			}
		};
	}
}