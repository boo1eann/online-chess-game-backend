import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { TokenBlacklist } from '../../../infrastructure/security/TokenBlacklist';
import { JwtService } from '../../../infrastructure/security/JwtService';
import { IUserRepository } from '../../repositories/IUserRepository';

export interface RefreshTokenDto {
	refreshToken: string;
}

export interface RefreshTokenResult {
	accessToken: string;
	refreshToken: string;
}

@injectable()
export class RefreshToken {
	constructor(
		@inject(TYPES.JwtService) private jwtService: JwtService,
		@inject(TYPES.TokenBlacklist) private tokenBlacklist: TokenBlacklist,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository) { }

	async execute(dto: RefreshTokenDto): Promise<RefreshTokenResult> {
		// Check if token is blacklisted
		const isBlacklisted = await this.tokenBlacklist.isBlackListed(dto.refreshToken);
		if (isBlacklisted) {
			throw new Error('Token has been revoked');
		}

		// Verify and decode token
		const payload = this.jwtService.verifyRefreshToken(dto.refreshToken);
		const user = await this.userRepository.findById(payload.userId);

		if (!user) {
			throw new Error('Invalid refresh token');
		}

		// Generate new tokens
		const accessToken = this.jwtService.generateAccessToken({
			userId: user.id,
			email: user.email,
			username: user.username,
		});

		const refreshToken = this.jwtService.generateRefreshToken({
			userId: payload.userId,
		});

		// Blacklist old refresh token
		await this.tokenBlacklist.add(dto.refreshToken);

		return {
			accessToken,
			refreshToken,
		};
	}
}