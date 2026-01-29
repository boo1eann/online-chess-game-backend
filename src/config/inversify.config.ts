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
import { JwtService } from '../infrastructure/security/JwtService';
import { LoginUser } from '../core/usecases/auth/LoginUser';
import { TokenBlacklist } from '../infrastructure/security/TokenBlacklist';
import { RefreshToken } from '../core/usecases/auth/RefreshToken';
import { AuthMiddleware } from '../application/middleware/AuthMiddleware';

const container = new Container;

// Bind Infrastructure
container.bind<PostgresClient>(TYPES.PostgresClient).to(PostgresClient).inSingletonScope();

// Bind Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);

// Bind Services
container.bind<WebSocketServer>(TYPES.WebSocketServer).to(WebSocketServer).inSingletonScope();
container.bind<PasswordHasher>(TYPES.PasswordHasher).to(PasswordHasher).inSingletonScope();
container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container.bind<TokenBlacklist>(TYPES.TokenBlacklist).to(TokenBlacklist).inSingletonScope();

// Bind Use Cases - Auth
container.bind<RegisterUser>(TYPES.RegisterUser).to(RegisterUser);
container.bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
container.bind<RefreshToken>(TYPES.RefreshToken).to(RefreshToken);

// Bind Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// Bind Middleware
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

export { container };