import { User } from '../../entities/user/user.entity';

export interface IUserRepository {
  createUser(user: User);
  findByEmail(email: string);
}

export const IUserRepository = Symbol('IUserRepository');
