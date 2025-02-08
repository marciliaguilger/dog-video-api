import { Login } from '../../entities/user/login.entity';
import { User } from '../../entities/user/user.entity';

export interface IUserUseCase {
  createUser(user: User);
  getUser(user: Login);
}

export const IUserUseCase = Symbol('IUserUseCase');
