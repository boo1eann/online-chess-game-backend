import { MatchEntity } from '../entities/Match';

export interface IGameRepository {
	createMatch(match: MatchEntity): Promise<MatchEntity>;
	findMatchById(id: string): Promise<MatchEntity | null>;
	findActiveMatchByPlayer(playerId: string): Promise<MatchEntity | null>;
}