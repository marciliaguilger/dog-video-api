import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { Item } from 'aws-sdk/clients/simpledb';

export interface IDynamoDbUsersRepository {
  update(id: string, updates: { [key: string]: any }): unknown;
  create(item: PutItemInputAttributeMap): Promise<void>;
  findByEmail(email: string);
  read(id: string): Promise<Item | null>;
}

export const IDynamoDbUsersRepository = Symbol('IDynamoDbUsersRepository');
