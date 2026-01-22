import { injectable } from 'inversify';

@injectable()
export class TokenBlacklist {
	private blacklist: Map<string, Date> = new Map();
	private cleanupInterval: NodeJS.Timeout;

	constructor() {
		this.cleanupInterval = setInterval(() => this.cleanup(), 3600000);
	}

	async add(token: string, expiresAt?: Date): Promise<void> {
		const expiry = expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default
		this.blacklist.set(token, expiry);
	}

	async isBlackListed(token: string): Promise<boolean> {
		const expiresAt = this.blacklist.get(token);
		if (!expiresAt) return false;

		if (expiresAt < new Date()) {
			this.blacklist.delete(token);
			return false;
		}

		return true;
	}

	async remove(token: string): Promise<void> {
		this.blacklist.delete(token);
	}

	private cleanup(): void {
		const now = new Date();
		for (const [token, expiresAt] of this.blacklist.entries()) {
			if (expiresAt < now) {
				this.blacklist.delete(token);
			}
		}
	}

	destroy(): void {
		clearInterval(this.cleanupInterval);
		this.blacklist.clear();
	}
}