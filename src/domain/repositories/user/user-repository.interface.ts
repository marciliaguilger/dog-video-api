import { User } from '../../entities/user/user.entity';

export interface IUserRepository {
  createUser(user: User);
  findByEmail(email: string);
  findById(id: string);
}

export const IUserRepository = Symbol('IUserRepository');
