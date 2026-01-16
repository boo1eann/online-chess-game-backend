import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
	userId: string;
	email?: string;
	username?: string;
}

@injectable()
export class JwtService {
	private readonly accessSecret: string;
	private readonly refreshSecret: string;
	private readonly accessExpiry: jwt.SignOptions["expiresIn"] = '15m';
	private readonly refreshExpiry: jwt.SignOptions["expiresIn"] = '7d';

	constructor() {
		this.accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-in-production';
		this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
	}

	generateAccessToken(payload: JwtPayload): string {
		return jwt.sign(payload, this.accessSecret, {
			expiresIn: this.accessExpiry,
		});
	}

	generateRefreshToken(payload: Pick<JwtPayload, 'userId'>): string {
		return jwt.sign(payload, this.refreshSecret, {
			expiresIn: this.refreshExpiry,
		});
	}

	verifyAccessToken(token: string): JwtPayload {
		try {
			return jwt.verify(token, this.accessSecret) as JwtPayload;
		} catch (error) {
			throw new Error('Invalid or expired access token');
		}
	}

	verifyRefreshToken(token: string): JwtPayload {
		try {
			return jwt.verify(token, this.refreshSecret) as JwtPayload;
		} catch (error) {
			throw new Error('Invalid or expired refresh token');
		}
	}

	decode(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch {
			return null;
		}
	}
}