export interface IVideoUseCase {
  processVideo(userId: string, video: Express.Multer.File);
  updateStatus(videoId: string, status: string, path?: string);
  downloadVideo(videoId: string): Promise<string>;
  getVideosByUser(userId: string);
}

export const IVideoUseCase = Symbol('IVideoUseCase');
