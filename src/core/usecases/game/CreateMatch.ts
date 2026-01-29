import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IGameRepository } from '../../repositories/IGameRepository';
import { MatchEntity } from '../../entities/Match';

export interface CreateMatchDto {
	playerId: string;
}

export interface CreateMatchResult {
	matchId: string;
	status: string;
	createdAt: Date;
}

@injectable()
export class CreateMatch {
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
			status: createdMatch.status,
			createdAt: createdMatch.createdAt,
		};
	}
}