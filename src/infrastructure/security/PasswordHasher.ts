import { injectable } from 'inversify';
import * as bcrypt from 'bcrypt';

@injectable()
export class PasswordHasher {
	private readonly saltRounds: number = 12;

	async hash(password: string): Promise<string> {
		return await bcrypt.hash(password, this.saltRounds);
	}

	async verify(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}