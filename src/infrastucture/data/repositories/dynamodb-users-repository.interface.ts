import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { UserModel } from '../models/user-item.interface';

export interface IDynamoDbUsersRepository {
  update(id: string, updates: { [key: string]: any }): unknown;
  create(item: PutItemInputAttributeMap): Promise<void>;
  findByEmail(email: string);
  read(userId: string): Promise<UserModel | null>;
}

export const IDynamoDbUsersRepository = Symbol('IDynamoDbUsersRepository');
