import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IUserRepository } from '../../repositories/IUserRepository';
import { PasswordHasher } from '../../../infrastructure/security/PasswordHasher';
import { JwtService } from '../../../infrastructure/security/JwtService';

export interface LoginUserDto {
	email: string;
	password: string;
}

export interface LoginUserResult {
	accessToken: string;
	refreshToken: string;
	userId: string;
	username: string;
}

@injectable()
export class LoginUser {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.PasswordHasher) private passwordHasher: PasswordHasher,
		@inject(TYPES.JwtService) private jwtService: JwtService
	) { }

	async execute(dto: LoginUserDto): Promise<LoginUserResult> {
		// Find user
		const user = await this.userRepository.findByEmail(dto.email);
		if (!user) {
			throw new Error('Invalid credentials');
		}

		if (!user.isActive) {
			throw new Error('Account is deactivated');
		}

		// Verify passowrd
		const isValid = await this.passwordHasher.verify(dto.password, user.passwordHash);
		if (!isValid) {
			throw new Error('Invalid credentials');
		}

		// Update last login
		user.updateLastLogin();
		await this.userRepository.update(user);

		// Generate tokens
		const accessToken = this.jwtService.generateAccessToken({
			userId: user.id,
			email: user.email,
			username: user.username,
		});

		const refreshToken = this.jwtService.generateRefreshToken({
			userId: user.id,
		});

		return {
			accessToken,
			refreshToken,
			userId: user.id,
			username: user.username,
		};
	}
}