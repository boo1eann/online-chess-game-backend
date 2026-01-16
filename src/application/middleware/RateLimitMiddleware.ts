import rateLimit from 'express-rate-limit';

export class RateLimitMiddleware {
	static createLimiter(windowMs: number = 15 * 60 * 1000, limit: number = 100) {
		return rateLimit({
			windowMs,
			limit,
			message: {
				success: false,
				error: 'Too many requests, please try again later',
			},
			standardHeaders: true,
			legacyHeaders: false,
		});
	}

	static authLimiter = RateLimitMiddleware.createLimiter(15 * 60 * 1000, 5);

	static generalLimiter = RateLimitMiddleware.createLimiter(15 * 60 * 1000, 100);

	static gameLimiter = RateLimitMiddleware.createLimiter(60 * 1000, 30);
}