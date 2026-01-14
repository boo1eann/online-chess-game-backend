// config/database.ts
export interface DatabaseConfig {
	host: string;
	port: number;
	database: string;
	user: string;
	password: string;
	max?: number;
	idleTimeoutMillis?: number;
	connectionTimeoutMillis?: number;
}

export function getDatabaseConfig(): DatabaseConfig {
	const host = process.env.DB_HOST;
	const port = process.env.DB_PORT;
	const database = process.env.DB_NAME;
	const user = process.env.DB_USER;
	const password = process.env.DB_PASSWORD;
	const max = process.env.DB_POOL_SIZE;

	if (!host || !port || !database || !user || !password || !max) {
		throw new Error('Database environment variables are not fully set');
	}

	return {
		host,
		port: parseInt(port),
		database,
		user,
		password,
		max: parseInt(max),
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	};
}
