import { Inject, Injectable } from '@nestjs/common';
import { IVideoUseCase } from './video-use-case.interface';
import { randomUUID } from 'crypto';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { UploadVideo } from 'src/domain/entities/video/upload-video.entity';
import { Video } from 'src/domain/entities/video/video.entity';

@Injectable()
export class VideoUseCase implements IVideoUseCase {
  constructor(
    @Inject(IVideoRepository)
    private readonly videoRepository: IVideoRepository,
  ) {}

  async processVideo(userId: string, video: Express.Multer.File) {
    const videoId = randomUUID();
    const videoPath = `videos/${videoId}/${video.originalname}`;

    const uploadData: UploadVideo = {
      bucket: 'your-bucket-name',
      key: videoPath,
      video,
    };

    try {
      await this.videoRepository.uploadOnS3(uploadData);
    } catch (error) {
      console.error('Error uploading video to S3:', error);
      throw new Error('Failed to upload video to storage. Please try again.');
    }

    const videoEntity: Video = {
      id: videoId,
      userId,
      status: 'CREATED',
      videoPathToBucket: videoPath,
    };

    try {
      this.videoRepository.createVideo(videoEntity);
    } catch (error) {
      console.error('Error saving video details:', error);
      throw new Error('Failed to save video metadata. Please try again.');
    }

    const messagePayload = { videoId, userId, videoPath };

    try {
      await this.videoRepository.publishEvent(
        'your-queue-url',
        JSON.stringify(messagePayload),
      );
    } catch (error) {
      console.error('Error publishing SQS event:', error);
      throw new Error('Failed to publish video processing event.');
    }

    return { videoId, videoPath };
  }

  async updateStatus(videoId: string, status: string, path?: string) {
    try {
      this.videoRepository.updateStatus(videoId, status, path);
      console.log('Updated successfully.');
      return videoId;
    } catch (error) {
      console.error(error.message);
    }
  }

  async downloadVideo(videoId: string) {
    const bucketName = 'your-bucket-name';
    let video;

    try {
      video = await this.videoRepository.findVideoById(videoId);
      if (!video) {
        throw new Error('Video not found.');
      }
      console.log('Video item retrieved successfully.');
    } catch (error) {
      console.error('Error fetching video from database:', error.message);
      throw new Error('Failed to retrieve video metadata.');
    }

    try {
      if (!video.slicedVideoPathToBucket) {
        throw new Error('Video path is missing in the metadata.');
      }

      const fileContent = await this.videoRepository.downloadFromS3(
        bucketName,
        video.slicedVideoPathToBucket,
      );
      console.log('File downloaded successfully.');
      return fileContent;
    } catch (error) {
      console.error('Error downloading video from S3:', error.message);
      throw new Error('Failed to download video file.');
    }
  }
}
