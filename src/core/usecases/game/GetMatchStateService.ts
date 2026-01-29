import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IGameRepository } from '../../repositories/IGameRepository';

export interface GetMatchStateDto {
	matchId: string;
}

export interface GetMatchStateResult {
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
export class GetMatchStateService {
	constructor(@inject(TYPES.GameRepository) private gameRepository: IGameRepository) { }

	async execute(dto: GetMatchStateDto): Promise<GetMatchStateResult> {
		const match = await this.gameRepository.findMatchById(dto.matchId);
		if (!match) {
			throw new Error('Match not found');
		}

		return {
			matchId: match.id,
			player1Id: match.player1Id,
			player2Id: match.player2Id,
			status: match.status,
			currentTurn: match.currentTurn,
			moves: match.moves,
			result: match.result,
			winnerId: match.winnerId,
		};
	}
}