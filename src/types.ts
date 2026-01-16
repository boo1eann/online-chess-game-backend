export const TYPES = {
	// Repositories
	UserRepository: Symbol.for('UserRepository'),
	MatchRepository: Symbol.for('MatchRepository'),

	// Use Cases
	RegisterUser: Symbol.for('RegisterUser'),
	LoginUser: Symbol.for('LoginUser'),

	// Services
	WebSocketServer: Symbol.for('WebSocketServer'),
	PasswordHasher: Symbol.for('PasswordHasher'),
	JwtService: Symbol.for('JwtService'),

	// Infrastructure
	PostgresClient: Symbol.for('PostgresClient'),

	// Controllers
	AuthController: Symbol.for('AuthController'),
}
