export interface User {
	id: string;
	email: string;
	username: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
	lastLoginAt?: Date;
	isActive: boolean;
}

export class UserEntity implements User {
	constructor(
		public id: string,
		public email: string,
		public username: string,
		public passwordHash: string,
		public createdAt: Date,
		public updatedAt: Date,
		public isActive: boolean = true,
		public lastLoginAt?: Date
	) { }

	static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): UserEntity {
		return new UserEntity(
			crypto.randomUUID(),
			data.email,
			data.username,
			data.passwordHash,
			new Date(),
			new Date(),
			true,
			data.lastLoginAt
		);
	}

	updateLastLogin(): void {
		this.lastLoginAt = new Date();
		this.updatedAt = new Date();
	}
}