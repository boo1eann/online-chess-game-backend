import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PostgresClient } from '../database/PostgresClient';
import { PlayerEntity } from '../../core/entities/Player';
import { IMatchRepository } from '../../core/repositories/IMatchRepository';

@injectable()
export class MatchRepository implements IMatchRepository {
	constructor(
		@inject(TYPES.PostgresClient) private db: PostgresClient
	) { }

	async createPlayer(player: PlayerEntity): Promise<PlayerEntity> {
		const query = `
      INSERT INTO players (id, user_id, rating, wins, losses, draws, total_matches, level, experience, avatar_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

		const values = [
			player.id,
			player.userId,
			player.rating,
			player.wins,
			player.losses,
			player.draws,
			player.totalMatches,
			player.level,
			player.experience,
			player.avatarUrl,
			player.createdAt,
			player.updatedAt,
		];

		const result = await this.db.query(query, values);
		return this.mapRowToEntity(result.rows[0]);
	}

	private mapRowToEntity(row: any): PlayerEntity {
		return new PlayerEntity(
			row.id,
			row.user_id,
			row.rating,
			row.wins,
			row.losses,
			row.draws,
			row.total_matches,
			row.level,
			row.experience,
			new Date(row.created_at),
			new Date(row.updated_at),
			row.avatar_url
		);
	}
}