import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { Item } from 'aws-sdk/clients/simpledb';
import { VideoModel } from '../models/video.interface';

export interface IDynamoDbVideosRepository {
  updateVideoStatusAndPath(
    videoId: string,
    status: string,
    framePath?: string,
  ): Promise<void>;
  create(item: PutItemInputAttributeMap): Promise<void>;
  findByEmail(email: string);
  read(id: string): Promise<Item | null>;
  findVideosByUserId(userId: string): Promise<VideoModel[]>;
}

export const IDynamoDbVideosRepository = Symbol('IDynamoDbVideosRepository');
