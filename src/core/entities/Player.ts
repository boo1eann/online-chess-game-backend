export interface Player {
	id: string;
	userId: string;
	rating: number;
	wins: number;
	losses: number;
	draws: number;
	totalMatches: number;
	level: number;
	experience: number;
	avatarUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

export class PlayerEntity implements Player {
	constructor(
		public id: string,
		public userId: string,
		public rating: number,
		public wins: number,
		public losses: number,
		public draws: number,
		public totalMatches: number,
		public level: number,
		public experience: number,
		public createdAt: Date,
		public updatedAt: Date,
		public avatarUrl?: string
	) { }

	static create(userId: string): PlayerEntity {
		return new PlayerEntity(
			crypto.randomUUID(),
			userId,
			1000, // Starting rating
			0,
			0,
			0,
			0,
			1,
			0,
			new Date(),
			new Date()
		);
	}
}