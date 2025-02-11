import { UploadVideo } from 'src/domain/entities/video/upload-video.entity';
import { Video } from 'src/domain/entities/video/video.entity';
import { VideoModel } from 'src/infrastucture/data/models/video.interface';

export interface IVideoRepository {
  uploadOnS3(uploadVideo: UploadVideo);
  downloadFromS3(key: string): Promise<AWS.S3.GetObjectOutput>;
  createVideo(video: Video);
  publishEvent(message: string);
  updateStatus(id: string, status: string, path?: string);
  findVideoById(videoId: string): Promise<VideoModel>;
  findVideosByUserId(userId: string): Promise<VideoModel[]>;
}

export const IVideoRepository = Symbol('IVideoRepository');
