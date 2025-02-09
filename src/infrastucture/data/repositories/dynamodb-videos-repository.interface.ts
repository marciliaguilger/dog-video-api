import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { Item } from 'aws-sdk/clients/simpledb';
import { VideoModel } from '../models/video.interface';

export interface IDynamoDbVideosRepository {
  update(id: string, updates: { [key: string]: any }): unknown;
  create(item: PutItemInputAttributeMap): Promise<void>;
  findByEmail(email: string);
  read(id: string): Promise<Item | null>;
  findVideosByUserId(userId: string): Promise<VideoModel[]>;
}

export const IDynamoDbVideosRepository = Symbol('IDynamoDbVideosRepository');
