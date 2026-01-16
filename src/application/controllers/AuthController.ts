import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { RegisterUser } from '../../core/usecases/auth/RegisterUser';
import { LoginUser } from '../../core/usecases/auth/LoginUser';

@injectable()
export class AuthController {
	constructor(
		@inject(TYPES.RegisterUser) private registerUser: RegisterUser,
		@inject(TYPES.LoginUser) private loginUser: LoginUser,
	) { }
	async register(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.registerUser.execute(req.body);
			res.status(201).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.loginUser.execute(req.body);

			res.status(200).json({
				success: true,
				data: result
			});
		} catch (error) {
			next(error);
		}
	}
}