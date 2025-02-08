import { Module } from '@nestjs/common';
import { IUserUseCase } from 'src/domain/use-cases/user/user-use-case.interface';
import { UserUseCase } from 'src/domain/use-cases/user/user-use-case.service';
import { UserController } from './controller/user.controller';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { UserRepository } from 'src/infrastucture/data/repositories/user.repository';
import { DynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb.repository';
import { IDynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb-repository.interface';

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
    DynamoDbRepository,
    {
      provide: IDynamoDbRepository,
      useFactory: () => new DynamoDbRepository('users'),
      useClass: DynamoDbRepository,
    },
  ],
})
export class UserModule {}
