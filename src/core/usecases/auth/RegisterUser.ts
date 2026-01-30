import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IUserRepository } from '../../repositories/IUserRepository';
import { PasswordHasher } from '../../../infrastructure/security/PasswordHasher';
import { UserEntity } from '../../entities/User';
import { PlayerEntity } from '../../entities/Player';
import { IMatchRepository } from '../../repositories/IMatchRepository';
import { ConflictError } from '../../../application/errors/ConflictError';

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
		// Check if user exists
		const exists = await this.userRepository.exists(dto.email, dto.username);
		if (exists) {
			throw new ConflictError('User with this email or username already exists');
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