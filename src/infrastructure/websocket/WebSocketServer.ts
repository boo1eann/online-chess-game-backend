import { injectable } from 'inversify';
import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

@injectable()
export class WebSocketServer {
	private io: Server | null = null;

	initialize(httpServer: HTTPServer): void {
		this.io = new Server(httpServer, {
			cors: {
				origin: process.env.CORS_ORIGINS || '*',
				methods: ['GET', 'POST'],
				credentials: true,
			},
			transports: ['websocket', 'polling'],
		});

		console.log('WebSocket server initialized');
	}
}