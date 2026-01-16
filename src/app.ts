import express, { Router } from 'express'

import type { Express } from 'express';
import { container } from './config/inversify.config';
import { AuthController } from './application/controllers/AuthController';
import { TYPES } from './types';
import { ErrorMiddleware } from './application/middleware/ErrorMiddleware';
import { RateLimitMiddleware } from './application/middleware/RateLimitMiddleware';

export function createApp(): Express {
	const app = express();
	// Security middleware

	// General middleware
	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true, limit: '10mb' }));

	// Rate limiting
	app.use(RateLimitMiddleware.generalLimiter);

	// Controllers
	const authController = container.get<AuthController>(TYPES.AuthController);

	// Routes
	const apiRouter = Router();

	// Health check
	app.get('/health', (req, res) => {
		res.status(200).json({
			status: 'ok',
			timestamp: new Date().toISOString(),
		});
	});

	// Auth routes
	const authRouter = Router();
	authRouter.post('/register', RateLimitMiddleware.authLimiter, authController.register.bind(authController));
	authRouter.post('/login', RateLimitMiddleware.authLimiter, authController.login.bind(authController));

	// Game routes
	// Player routes
	// Mount routes
	apiRouter.use('/auth', authRouter);

	app.use('/api/v1', apiRouter);

	// 404 handler
	app.use(ErrorMiddleware.notFound);

	// Error handler (must be last)
	app.use(ErrorMiddleware.handle);

	return app;
}