import { MatchEntity } from '../entities/Match';

export interface IGameRepository {
	createMatch(match: MatchEntity): Promise<MatchEntity>;
	findActiveMatchByPlayer(playerId: string): Promise<MatchEntity | null>;
}