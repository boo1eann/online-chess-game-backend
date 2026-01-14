export const appConfig = {
	port: parseInt(process.env.PORT || '3000'),
	nodeEnv: process.env.NODE_ENV || 'development',
	corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:8081',
	apiPrefix: process.env.API_PREFIX || '/api/v1',
}