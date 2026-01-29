import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { CreateMatchService } from '../../core/usecases/game/CreateMatchService';
import { GetMatchStateService } from '../../core/usecases/game/GetMatchStateService';

export interface AuthenticatedRequest extends Request {
	userId?: string;
	username?: string;
}

@injectable()
export class GameController {
	constructor(
		@inject(TYPES.CreateMatch) private createMatchService: CreateMatchService,
		@inject(TYPES.GetMatchState) private getMatchStateService: GetMatchStateService
	) { }

	async createMatch(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.createMatchService.execute({
				playerId: req.userId!
			});

			res.status(201).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async getMatchState(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const matchId = req.params.matchId as string;
			const result = await this.getMatchStateService.execute({ matchId });

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}