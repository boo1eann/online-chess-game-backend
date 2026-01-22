export const TYPES = {
	// Repositories
	UserRepository: Symbol.for('UserRepository'),
	MatchRepository: Symbol.for('MatchRepository'),

	// Use Cases
	RegisterUser: Symbol.for('RegisterUser'),
	LoginUser: Symbol.for('LoginUser'),
	RefreshToken: Symbol.for('RefreshToken'),

	// Services
	WebSocketServer: Symbol.for('WebSocketServer'),
	PasswordHasher: Symbol.for('PasswordHasher'),
	JwtService: Symbol.for('JwtService'),
	TokenBlacklist: Symbol.for('TokenBlacklist'),

	// Infrastructure
	PostgresClient: Symbol.for('PostgresClient'),

	// Controllers
	AuthController: Symbol.for('AuthController'),
}
