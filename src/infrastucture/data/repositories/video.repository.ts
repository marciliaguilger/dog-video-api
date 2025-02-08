import { Inject } from '@nestjs/common';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { IDynamoDbRepository } from './dynamodb-repository.interface';
import { UploadVideo } from 'src/domain/entities/video/upload-video.entity';
import { Video } from 'src/domain/entities/video/video.entity';
import { DynamoDB, S3, SQS } from 'aws-sdk';
import { Item } from 'aws-sdk/clients/simpledb';
import { VideoModel } from '../models/video.interface';

export class VideoRepository implements IVideoRepository {
  private s3 = new S3();
  private sqs = new SQS();
  constructor(
    @Inject(IDynamoDbRepository)
    private readonly db: IDynamoDbRepository,
  ) {}
  async uploadOnS3(uploadVideoBucket: UploadVideo) {
    await this.s3
      .upload({
        Bucket: uploadVideoBucket.bucket,
        Key: uploadVideoBucket.key,
        Body: uploadVideoBucket.video.buffer,
        ContentType: uploadVideoBucket.video.mimetype,
      })
      .promise();
  }
  async downloadFromS3(bucket: string, key: string): Promise<Buffer> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    try {
      const response = await this.s3.getObject(params).promise();
      if (!response.Body) {
        throw new Error('File content is empty');
      }
      return response.Body as Buffer;
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw new Error('Failed to download file. Please try again.');
    }
  }
  createVideo(video: Video) {
    const item = convertVideoEntityToDynamoItem(video);
    try {
      this.db.create(item);
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  }
  async updateStatus(id: string, status: string, path?: string): Promise<void> {
    const updates: { [key: string]: any } = { status };
    if (path) {
      updates.slicedVideoPathToBucket = path;
    }

    try {
      await this.db.update(id, updates);
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }
  async publishEvent(queueUrl: string, message: string) {
    await this.sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: message,
      })
      .promise();
  }

  async createUser(video: Video) {
    const item = convertVideoEntityToDynamoItem(video);
    try {
      this.db.create(item);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async findVideoById(videoId: string): Promise<VideoModel> {
    const item = await this.db.read(videoId);
    return convertDynamoItemToModel(item);
  }
}

const convertVideoEntityToDynamoItem = (
  video: Video,
): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
  return {
    id: video.id,
    userId: video.userId,
    status: video.status,
    videoPathToBucket: video.videoPathToBucket,
    slicedVideoPathToBucket: video.slicedVideoPathToBucket,
  };
};

const convertDynamoItemToModel = (dynamoItem: Item): VideoModel => {
  return {
    id: dynamoItem.Attributes['id'],
    userId: dynamoItem.Attributes['userId'],
    status: dynamoItem.Attributes['status'],
    videoPathToBucket: dynamoItem.Attributes['videoPathToBucket'],
    slicedVideoPathToBucket: dynamoItem.Attributes['slicedVideoPathToBucket'],
  };
};
