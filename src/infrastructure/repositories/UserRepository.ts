import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { TYPES } from '../../types';
import { PostgresClient } from '../database/PostgresClient';
import { UserEntity } from '../../core/entities/User';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(TYPES.PostgresClient) private db: PostgresClient
	) { }

	async create(user: UserEntity): Promise<UserEntity> {
		const query = `
      INSERT INTO users (id, email, username, password_hash, created_at, updated_at, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

		const values = [
			user.id,
			user.email,
			user.username,
			user.passwordHash,
			user.createdAt,
			user.updatedAt,
			user.isActive,
		];

		const result = await this.db.query(query, values);
		return this.mapRowToEntity(result.rows[0]);
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const query = 'SELECT * FROM users WHERE email = $1';
		const result = await this.db.query(query, [email]);
		return result.rows[0] ? this.mapRowToEntity(result.rows[0]) : null;
	}

	async findById(id: string): Promise<UserEntity | null> {
		const query = 'SELECT * FROM users WHERE id = $1';
		const result = await this.db.query(query, [id]);
		return result.rows[0] ? this.mapRowToEntity(result.rows[0]) : null;
	}

	async update(user: UserEntity): Promise<UserEntity> {
		const query = `
			UPDATE users
			SET email = $2, username = $3, password_hash = $4, updated_at = $5,
				last_login_at = $6, is_active = $7
			WHERE id = $1
			RETURNING *
    	`;

		const values = [
			user.id,
			user.email,
			user.username,
			user.passwordHash,
			user.updatedAt,
			user.lastLoginAt,
			user.isActive,
		];

		const result = await this.db.query(query, values);
		return this.mapRowToEntity(result.rows[0]);
	}

	async exists(email: string, username: string): Promise<boolean> {
		const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 OR username = $2)';
		const result = await this.db.query(query, [email, username]);
		return result.rows[0].exists;
	}

	private mapRowToEntity(row: any): UserEntity {
		return new UserEntity(
			row.id,
			row.email,
			row.username,
			row.password_hash,
			new Date(row.created_at),
			new Date(row.updated_at),
			row.is_active,
			row.last_login_at ? new Date(row.last_login_at) : undefined
		);
	}
}