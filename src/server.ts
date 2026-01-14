import { createServer } from 'http'

import { config } from 'dotenv';

import { createApp } from './app';
import { appConfig } from './config/app.config';
import { container } from './config/inversify.config';
import { TYPES } from './types';

import type { PostgresClient } from './infrastructure/database/PostgresClient';
import type { WebSocketServer } from './infrastructure/websocket/WebSocketServer';

config();

async function bootstrap() {
	try {
		console.log('Starting application...');

		// Initialize database
		const db = container.get<PostgresClient>(TYPES.PostgresClient);
		await db.connect();

		// Create Express app
		const app = createApp();

		// Create HTTP Server
		const httpServer = createServer(app);

		// Initialize WebSocket server
		const wsServer = container.get<WebSocketServer>(TYPES.WebSocketServer);
		wsServer.initialize(httpServer);

		// Start server
		const port = appConfig.port;
		httpServer.listen(port, () => {
			console.log(`Server is running on port ${port}`);
			console.log(`Environment: ${appConfig.nodeEnv}`);
			console.log(`API endpoint: http://localhost:${port}/api/v1`);
			console.log(`WebSocket endpoint: ws://localhost:${port}`);
		});

		// Graceful shutdown
		// Force shutdown after 30 seconds
	} catch (error) {
		console.error('Failed to start application:', error);
		process.exit(1);
	}
}

bootstrap();