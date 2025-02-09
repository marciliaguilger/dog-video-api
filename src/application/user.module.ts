import { Module } from '@nestjs/common';
import { IUserUseCase } from 'src/domain/use-cases/user/user-use-case.interface';
import { UserUseCase } from 'src/domain/use-cases/user/user-use-case.service';
import { UserController } from './controller/user.controller';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { UserRepository } from 'src/infrastucture/data/repositories/user.repository';
import { IDynamoDbUsersRepository } from 'src/infrastucture/data/repositories/dynamodb-users-repository.interface';
import { DynamoDbUsersRepository } from 'src/infrastucture/data/repositories/dynamodb-users.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserUseCase,
    {
      provide: IUserUseCase,
      useClass: UserUseCase,
    },
    UserRepository,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    DynamoDbUsersRepository,
    {
      provide: IDynamoDbUsersRepository,
      useClass: DynamoDbUsersRepository,
    },
  ],
})
export class UserModule {}
