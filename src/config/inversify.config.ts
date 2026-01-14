import { Container } from 'inversify';
import { TYPES } from '../types';
import { WebSocketServer } from '../infrastructure/websocket/WebSocketServer';
import { PostgresClient } from '../infrastructure/database/PostgresClient';

const container = new Container;

// Bind Infrastructure
container.bind<PostgresClient>(TYPES.PostgresClient).to(PostgresClient).inSingletonScope();

// Bind Services
container.bind<WebSocketServer>(TYPES.WebSocketServer).to(WebSocketServer).inSingletonScope();

export { container };