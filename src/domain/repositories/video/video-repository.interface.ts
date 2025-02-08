import { UploadVideo } from 'src/domain/entities/video/upload-video.entity';
import { Video } from 'src/domain/entities/video/video.entity';
import { VideoModel } from 'src/infrastucture/data/models/video.interface';

export interface IVideoRepository {
  uploadOnS3(uploadVideoBucket: UploadVideo);
  downloadFromS3(bucket: string, key: string): Promise<Buffer>;
  createVideo(video: Video);
  publishEvent(queueUrl: string, message: string);
  updateStatus(id: string, status: string, path?: string);
  findVideoById(videoId: string): Promise<VideoModel>;
}

export const IVideoRepository = Symbol('IVideoRepository');
