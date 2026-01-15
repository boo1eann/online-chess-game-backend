import { PlayerEntity } from '../entities/Player';

export interface IMatchRepository {
	createPlayer(player: PlayerEntity): Promise<PlayerEntity>;
	// findPlayerById(id: string): Promise<PlayerEntity | null>;
	// findPlayerByUserId(userId: string): Promise<PlayerEntity | null>;
	// updatePlayer(player: PlayerEntity): Promise<PlayerEntity>;
	// getLeaderboard(limit: number, offset: number): Promise<PlayerEntity[]>;
	// getPlayerRank(playerId: string): Promise<number>;
}