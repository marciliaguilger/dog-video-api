import { UserModel } from 'src/infrastucture/data/models/user-item.interface';
import { User } from '../../entities/user/user.entity';

export interface IUserRepository {
  createUser(user: User);
  findByEmail(email: string): Promise<UserModel>;
  findById(id: string);
}

export const IUserRepository = Symbol('IUserRepository');
