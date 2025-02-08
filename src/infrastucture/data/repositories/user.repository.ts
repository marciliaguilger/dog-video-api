import { Inject } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { IDynamoDbRepository } from './dynamodb-repository.interface';
import { User } from 'src/domain/entities/user/user.entity';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Item } from 'aws-sdk/clients/simpledb';
import { UserModel } from '../models/user-item.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @Inject(IDynamoDbRepository)
    private readonly db: IDynamoDbRepository,
  ) {}

  async createUser(user: User) {
    const item = convertUserEntityToDynamoItem(user);
    try {
      this.db.create(item);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    const item = await this.db.findByEmail(email);
    return convertDynamoItemToModel(item);
  }
}

const convertUserEntityToDynamoItem = (
  user: User,
): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
  };
};

const convertDynamoItemToModel = (dynamoItem: Item): UserModel => {
  return {
    id: dynamoItem.Attributes['id'],
    email: dynamoItem.Attributes['email'],
    password: dynamoItem.Attributes['password'],
  };
};
