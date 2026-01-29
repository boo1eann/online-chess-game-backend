export enum MatchStatus {
	WAITING = 'waiting',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

export enum GameResult {
	PLAYER1_WIN = 'player1_win',
	PLAYER2_WIN = 'player2_win',
	DRAW = 'draw',
}

export interface Move {
	playerId: string;
	position: { x: number; y: number };
	timestamp: Date;
}

export interface Match {
	id: string;
	player1Id: string;
	player2Id?: string;
	status: MatchStatus;
	currentTurn: string;
	moves: Move[];
	result?: GameResult;
	winnerId?: string;
	startedAt?: Date;
	completedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export class MatchEntity implements Match {
	constructor(
		public id: string,
		public player1Id: string,
		public status: MatchStatus,
		public currentTurn: string,
		public moves: Move[],
		public createdAt: Date,
		public updatedAt: Date,
		public player2Id?: string,
		public result?: GameResult,
		public winnerId?: string,
		public startedAt?: Date,
		public completedAt?: Date
	) { }

	static create(player1Id: string): MatchEntity {
		return new MatchEntity(
			crypto.randomUUID(),
			player1Id,
			MatchStatus.WAITING,
			player1Id,
			[],
			new Date(),
			new Date()
		);
	}
}