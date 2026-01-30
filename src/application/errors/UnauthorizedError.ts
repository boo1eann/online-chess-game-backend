import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
	constructor(message: string, code?: string) {
		super(message, 401, true, code);
	}
}