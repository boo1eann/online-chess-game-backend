import cors from 'cors';

export class CorsMiddleware {
	static create() {
		const allowedOrigin = process.env.CORS_ORIGINS || 'http://localhost:5173';

		return cors({
			origin: (origin, callback) => {
				if (!origin || origin === allowedOrigin) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			exposedHeaders: ['Content-Range', 'X-Content-Range'],
			maxAge: 86400,
		});
	}
}