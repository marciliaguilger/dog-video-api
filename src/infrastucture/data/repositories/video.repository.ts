import { Inject } from '@nestjs/common';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { UploadVideo } from 'src/domain/entities/video/upload-video.entity';
import { Video } from 'src/domain/entities/video/video.entity';
import { DynamoDB } from 'aws-sdk';
import { Item } from 'aws-sdk/clients/simpledb';
import { VideoModel } from '../models/video.interface';
import { IS3Repository } from './s3-repository.interface';
import { IMessageProducerRepository } from './sqs.repository.interface';
import { IDynamoDbVideosRepository } from './dynamodb-videos-repository.interface';

export class VideoRepository implements IVideoRepository {
  constructor(
    @Inject(IDynamoDbVideosRepository)
    private readonly db: IDynamoDbVideosRepository,
    @Inject(IS3Repository)
    private readonly s3: IS3Repository,
    @Inject(IMessageProducerRepository)
    private readonly sqs: IMessageProducerRepository,
  ) {}
  async uploadOnS3(uploadVideo: UploadVideo) {
    await this.s3.uploadFile(uploadVideo.video, uploadVideo.path);
  }
  async downloadFromS3(key: string): Promise<Buffer> {
    try {
      return await this.s3.downloadFile(key);
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw new Error('Failed to download file. Please try again.');
    }
  }
  createVideo(video: Video) {
    const item = this.convertVideoEntityToDynamoItem(video);
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
  async publishEvent(message: string) {
    await this.sqs.send(message);
  }

  async findVideoById(videoId: string): Promise<VideoModel> {
    const item = await this.db.read(videoId);
    return this.convertDynamoItemToModel(item);
  }

  async findVideosByUserId(userId: string): Promise<VideoModel[]> {
    return await this.db.findVideosByUserId(userId);
  }

  convertVideoEntityToDynamoItem = (
    video: Video,
  ): DynamoDB.DocumentClient.PutItemInputAttributeMap => {
    return {
      videoId: video.id,
      userId: video.userId,
      status: video.status,
      videoPath: video.videoPath,
      framePath: video.framePath,
    };
  };

  convertDynamoItemToModel = (dynamoItem: Item): VideoModel => {
    return {
      id: dynamoItem.Attributes['videoId'],
      userId: dynamoItem.Attributes['userId'],
      status: dynamoItem.Attributes['status'],
      videoPath: dynamoItem.Attributes['videoPath'],
      framePath: dynamoItem.Attributes['framePath'],
    };
  };
}
