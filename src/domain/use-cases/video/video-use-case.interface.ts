export interface IVideoUseCase {
  processVideo(userId: string, video: Express.Multer.File);
  updateStatus(videoId: string, status: string, path?: string);
  downloadVideo(videoId: string): Promise<AWS.S3.Body>;
  getVideosByUser(userId: string);
}

export const IVideoUseCase = Symbol('IVideoUseCase');
