import express, { Router } from 'express'
import type { Express } from 'express';
import { container } from './config/inversify.config';
import { AuthController } from './application/controllers/AuthController';
import { TYPES } from './types';
import { ErrorMiddleware } from './application/middleware/ErrorMiddleware';
import { RateLimitMiddleware } from './application/middleware/RateLimitMiddleware';
import { ValidationMiddleware } from './application/middleware/ValidationMiddleware';
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from './application/validators/AuthValidator';
import { CorsMiddleware } from './application/middleware/CorsMiddleware';
import { AuthMiddleware } from './application/middleware/AuthMiddleware';
import { GameController } from './application/controllers/GameController';

export function createApp(): Express {
	const app = express();
	// Security middleware

	// General middleware
	app.use(CorsMiddleware.create());
	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true, limit: '10mb' }));

	// Rate limiting
	app.use(RateLimitMiddleware.generalLimiter);

	// Controllers
	const authController = container.get<AuthController>(TYPES.AuthController);
	const gameController = container.get<GameController>(TYPES.GameController);
	const authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

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
	authRouter.post(
		'/register',
		RateLimitMiddleware.authLimiter,
		ValidationMiddleware.validate(RegisterSchema),
		authController.register.bind(authController));

	authRouter.post(
		'/login',
		RateLimitMiddleware.authLimiter,
		ValidationMiddleware.validate(LoginSchema),
		authController.login.bind(authController));

	authRouter.post(
		'/refresh',
		ValidationMiddleware.validate(RefreshTokenSchema),
		authController.refresh.bind(authController));

	// Game routes
	const gameRouter = Router();
	gameRouter.use(authMiddleware.authenticate());

	gameRouter.post(
		'/matches',
		RateLimitMiddleware.gameLimiter,
		gameController.createMatch.bind(gameController)
	);

	// Player routes
	// Mount routes
	apiRouter.use('/auth', authRouter);
	apiRouter.use('/game', gameRouter);

	app.use('/api/v1', apiRouter);

	// 404 handler
	app.use(ErrorMiddleware.notFound);

	// Error handler (must be last)
	app.use(ErrorMiddleware.handle);

	return app;
}