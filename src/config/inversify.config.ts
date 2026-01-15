import { Container } from 'inversify';
import { TYPES } from '../types';
import { WebSocketServer } from '../infrastructure/websocket/WebSocketServer';
import { PostgresClient } from '../infrastructure/database/PostgresClient';
import { AuthController } from '../application/controllers/AuthController';
import { RegisterUser } from '../core/usecases/auth/RegisterUser';
import { IUserRepository } from '../core/repositories/IUserRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { PasswordHasher } from '../infrastructure/security/PasswordHasher';
import { IMatchRepository } from '../core/repositories/IMatchRepository';
import { MatchRepository } from '../infrastructure/repositories/MatchRepository';

const container = new Container;

// Bind Infrastructure
container.bind<PostgresClient>(TYPES.PostgresClient).to(PostgresClient).inSingletonScope();

// Bind Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);

// Bind Services
container.bind<WebSocketServer>(TYPES.WebSocketServer).to(WebSocketServer).inSingletonScope();
container.bind<PasswordHasher>(TYPES.PasswordHasher).to(PasswordHasher).inSingletonScope();

// Bind Use Cases - Auth
container.bind<RegisterUser>(TYPES.RegisterUser).to(RegisterUser);

// Bind Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };