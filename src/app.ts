import express from 'express'

import type { Express } from 'express';

export function createApp(): Express {
	const app = express()
	// Security middleware
	// General middleware
	// Rate limiting
	// Controllers
	// Routes
	// Health check
	// Auth routes
	// Game routes
	// Player routes
	// Mount routes

	// app.use('/api/v1', apiRouter);

	// 404 handler
	// Error handler (must be last)
	return app;
}