import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { CreateMatch } from '../../core/usecases/game/CreateMatch';

export interface AuthenticatedRequest extends Request {
	userId?: string;
	username?: string;
}

@injectable()
export class GameController {
	constructor(@inject(TYPES.CreateMatch) private createMatchService: CreateMatch) { }

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
}