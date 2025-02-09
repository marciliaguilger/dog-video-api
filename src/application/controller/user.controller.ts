import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserInput } from '../dtos/input/user.input';
import { User } from 'src/domain/entities/user/user.entity';
import { randomUUID } from 'crypto';
import { IUserUseCase } from 'src/domain/use-cases/user/user-use-case.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject(IUserUseCase)
    private readonly userUsecase: IUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() userInput: UserInput) {
    console.log('Criando novo usuário');
    const user = User.buildUser(
      userInput.password,
      userInput.email,
      randomUUID(),
    );
    return {
      id: await this.userUsecase.createUser(user),
    };
  }

  @Post()
  async validateUser(@Body() userInput: UserInput) {
    console.log('Validando usuário');

    return await this.userUsecase.getUser(userInput);
  }
}
