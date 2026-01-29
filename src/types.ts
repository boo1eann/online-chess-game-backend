export const TYPES = {
	// Repositories
	UserRepository: Symbol.for('UserRepository'),
	GameRepository: Symbol.for('GameRepository'),
	MatchRepository: Symbol.for('MatchRepository'),

	// Use Cases
	RegisterUser: Symbol.for('RegisterUser'),
	LoginUser: Symbol.for('LoginUser'),
	RefreshToken: Symbol.for('RefreshToken'),
	CreateMatch: Symbol.for('CreateMatch'),

	// Services
	WebSocketServer: Symbol.for('WebSocketServer'),
	PasswordHasher: Symbol.for('PasswordHasher'),
	JwtService: Symbol.for('JwtService'),
	TokenBlacklist: Symbol.for('TokenBlacklist'),

	// Infrastructure
	PostgresClient: Symbol.for('PostgresClient'),

	// Controllers
	AuthController: Symbol.for('AuthController'),
	GameController: Symbol.for('GameController'),
}
