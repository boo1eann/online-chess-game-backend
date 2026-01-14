import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DatabaseConfig, getDatabaseConfig } from '../../config/database.config';
import { injectable } from 'inversify';

@injectable()
export class PostgresClient {
	private pool: Pool;
	private isConnected: boolean = false;

	constructor() {
		const config: DatabaseConfig = getDatabaseConfig();

		this.pool = new Pool(config);

		this.pool.on('error', (err) => {
			console.error('Unexpected error on idle client', err);
		});
	}

	async connect(): Promise<void> {
		try {
			await this.pool.query('SELECT NOW()');
			this.isConnected = true;
			console.log('Database connected successfully');
		} catch (error) {
			console.error('Database connection failed', error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		await this.pool.end();
		this.isConnected = false;
		console.log('Database disconnected');
	}

	async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
		const start = Date.now();
		try {
			const result = await this.pool.query<T>(text, params);
			const duration = Date.now() - start;
			console.log('Executed query', { text, duration, rows: result.rowCount });
			return result;
		} catch (error) {
			console.error('Query error', { text, error });
			throw error;
		}
	}

	async getClient(): Promise<PoolClient> {
		return await this.pool.connect();
	}

	async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
		const client = await this.getClient();
		try {
			await client.query('BEGIN');
			const result = await callback(client);
			await client.query('COMMIT');
			return result;
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	getPool(): Pool {
		return this.pool;
	}
}