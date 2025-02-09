import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user/user.entity';
import { IUserUseCase } from './user-use-case.interface';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { Login } from '../../entities/user/login.entity';

@Injectable()
export class UserUseCase implements IUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(user: User) {
    await this.userRepository.createUser(user);
    return user.id;
  }

  async getUser(user: Login) {
    const userValidated = await this.userRepository.findByEmail(user.email);
    console.log('userValidated: ', userValidated);
    console.log('user.password: ', user.password);

    if (userValidated != null && userValidated.password == user.password) {
      return userValidated.userId;
    }
    return null;
  }
}
