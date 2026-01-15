export const TYPES = {
	// Repositories
	UserRepository: Symbol.for('UserRepository'),
	MatchRepository: Symbol.for('MatchRepository'),

	// Use Cases
	RegisterUser: Symbol.for('RegisterUser'),

	// Services
	WebSocketServer: Symbol.for('WebSocketServer'),
	PasswordHasher: Symbol.for('PasswordHasher'),

	// Infrastructure
	PostgresClient: Symbol.for('PostgresClient'),

	// Controllers
	AuthController: Symbol.for('AuthController'),
}
