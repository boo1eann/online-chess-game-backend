import { UserEntity } from '../entities/User';

export interface IUserRepository {
	create(user: UserEntity): Promise<UserEntity>;
	// findById(id: string): Promise<UserEntity | null>;
	// findByEmail(email: string): Promise<UserEntity | null>;
	// findByUsername(username: string): Promise<UserEntity | null>;
	// update(user: UserEntity): Promise<UserEntity>;
	// delete(id: string): Promise<void>;
	exists(email: string, username: string): Promise<boolean>;
}