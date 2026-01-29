import { inject, injectable } from 'inversify';
import { IGameRepository } from '../../core/repositories/IGameRepository';
import { TYPES } from '../../types';
import { PostgresClient } from '../database/PostgresClient';
import { MatchEntity, MatchStatus } from '../../core/entities/Match';

@injectable()
export class GameRepository implements IGameRepository {
	constructor(@inject(TYPES.PostgresClient) private db: PostgresClient) { }

	async createMatch(match: MatchEntity): Promise<MatchEntity> {
		const query = `
			INSERT INTO matches (id, player1_id, player2_id, status, current_turn, moves, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING *
		`;

		const values = [
			match.id,
			match.player1Id,
			match.player2Id,
			match.status,
			match.currentTurn,
			JSON.stringify(match.moves),
			match.createdAt,
			match.updatedAt,
		];

		const result = await this.db.query(query, values);
		return this.mapRowToEntity(result.rows[0]);
	}

	async findActiveMatchByPlayer(playerId: string): Promise<MatchEntity | null> {
		const query = `
			SELECT * FROM matches
			WHERE (player1_id = $1 OR player2_id = $1)
				AND status IN ($2, $3)
			LIMIT 1
		`;

		const result = await this.db.query(query, [playerId, MatchStatus.WAITING, MatchStatus.IN_PROGRESS]);
		return result.rows[0] ? this.mapRowToEntity(result.rows[0]) : null;
	}

	private mapRowToEntity(row: any): MatchEntity {
		return new MatchEntity(
			row.id,
			row.player1_id,
			row.status,
			row.current_turn,
			row.moves || [],
			new Date(row.created_at),
			new Date(row.updated_at),
			row.player2_id,
			row.result,
			row.winner_id,
			row.started_at ? new Date(row.started_at) : undefined,
			row.completed_at ? new Date(row.completed_at) : undefined
		);
	}
}