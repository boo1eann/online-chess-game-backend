import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IGameRepository } from '../../repositories/IGameRepository';
import { MatchEntity } from '../../entities/Match';

export interface CreateMatchDto {
	playerId: string;
}

export interface CreateMatchResult {
	matchId: string;
	player1Id: string;
	player2Id?: string;
	status: string;
	currentTurn: string;
	moves: any[];
	result?: string;
	winnerId?: string;
}

@injectable()
export class CreateMatchService {
	constructor(
		@inject(TYPES.GameRepository) private gameRepository: IGameRepository
	) { }

	async execute(dto: CreateMatchDto): Promise<CreateMatchResult> {
		// Check if player already has an active match
		const activeMatch = await this.gameRepository.findActiveMatchByPlayer(dto.playerId);
		if (activeMatch) {
			throw new Error('Player already has an active match');
		}

		// Create new match
		const match = MatchEntity.create(dto.playerId);
		const createdMatch = await this.gameRepository.createMatch(match);

		return {
			matchId: createdMatch.id,
			player1Id: createdMatch.player1Id,
			player2Id: createdMatch.player2Id,
			status: createdMatch.status,
			currentTurn: createdMatch.currentTurn,
			moves: createdMatch.moves,
			result: createdMatch.result,
			winnerId: createdMatch.winnerId,
		};
	}
}