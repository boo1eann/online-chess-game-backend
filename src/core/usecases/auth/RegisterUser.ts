import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IUserRepository } from '../../repositories/IUserRepository';
import { PasswordHasher } from '../../../infrastructure/security/PasswordHasher';
import { UserEntity } from '../../entities/User';
import { PlayerEntity } from '../../entities/Player';
import { IMatchRepository } from '../../repositories/IMatchRepository';

export interface RegisterUserDto {
	email: string;
	username: string;
	password: string;
}

export interface RegisterUserResult {
	userId: string;
	playerId: string;
	email: string;
	username: string;
}

@injectable()
export class RegisterUser {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.PasswordHasher) private passwordHasher: PasswordHasher,
		@inject(TYPES.MatchRepository) private matchRepository: IMatchRepository,
	) { }

	async execute(dto: RegisterUserDto): Promise<RegisterUserResult> {

		// Validate input
		// if (!this.isValidEmail(dto.email)) {
		// 	throw new Error('Invalid email format [from usecases]');
		// }

		// if (dto.username.length < 3 || dto.username.length > 20) {
		// 	throw new Error('Username must be between 3 and 20 characters [from usecases]');
		// }

		// if (dto.password.length < 8) {
		// 	throw new Error('Password must be at least 8 characters [from usecases]');
		// }

		// Check if user exists
		const exists = await this.userRepository.exists(dto.email, dto.username);
		if (exists) {
			throw new Error('User with this email or username already exists [from usecases]');
		}

		// Hash password
		const passwordHash = await this.passwordHasher.hash(dto.password);

		// Create user
		const user = UserEntity.create({
			email: dto.email,
			username: dto.username,
			passwordHash,
		});

		const createdUser = await this.userRepository.create(user);

		// Create player profile
		const player = PlayerEntity.create(createdUser.id);
		const createdPlayer = await this.matchRepository.createPlayer(player);

		return {
			userId: createdUser.id,
			playerId: createdPlayer.id,
			email: createdUser.email,
			username: createdUser.username,
		};
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}