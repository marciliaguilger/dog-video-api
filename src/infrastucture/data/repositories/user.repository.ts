import { Inject } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { User } from 'src/domain/entities/user/user.entity';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Item } from 'aws-sdk/clients/simpledb';
import { UserModel } from '../models/user-item.interface';
import { IDynamoDbUsersRepository } from './dynamodb-users-repository.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @Inject(IDynamoDbUsersRepository)
    private readonly db: IDynamoDbUsersRepository,
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
    console.log('ITEM')
    console.log(item)
    return convertDynamoItemToModel(item);
  }

  async findById(id: string): Promise<UserModel> {
    const item = await this.db.read(id);
    return convertDynamoItemToModel(item);
  }
}

const convertUserEntityToDynamoItem = (
  user: User,
): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
  return {
    userId: user.id,
    email: user.email,
    password: user.password,
  };
};

const convertDynamoItemToModel = (dynamoItem: Item): UserModel => {
  return {
    id: dynamoItem.Attributes['userId'],
    email: dynamoItem.Attributes['email'],
    password: dynamoItem.Attributes['password'],
  };
};
