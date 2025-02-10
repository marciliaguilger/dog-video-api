import {
  Body,
  Controller,
  ForbiddenException,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserInput } from '../dtos/input/user.input';
import { User } from 'src/domain/entities/user/user.entity';
import { randomUUID } from 'crypto';
import { IUserUseCase } from 'src/domain/use-cases/user/user-use-case.interface';
import { AuthService } from 'src/domain/use-cases/auth/auth.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    @Inject(IUserUseCase)
    private readonly userUsecase: IUserUseCase,
    private readonly authService: AuthService
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

  @Post('login')
  async validateUser(@Body() userInput: UserInput) {
    console.log('Validating user');
    const result = await this.userUsecase.getUser(userInput);

    if (!result) {
      throw new ForbiddenException('Invalid user credentials');
    }

    const token = await this.authService.generateJwtToken(result);
    return { accessToken: token };
  }
}
