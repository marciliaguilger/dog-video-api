import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { IVideoUseCase } from 'src/domain/use-cases/video/video-use-case.interface';
import { Readable } from 'stream';

@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(
    @Inject(IVideoUseCase)
    private readonly videoUseCase: IVideoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Body('user_id') userId: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    if (!userId || !video) {
      throw new Error('user_id and video file are required.');
    }

    const result = await this.videoUseCase.processVideo(userId, video);
    return { message: 'Video uploaded successfully', videoId: result.videoId };
  }

  @Patch(':videoId/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('videoId') videoId: string,
    @Body('status') status: string,
    @Body('path') path?: string,
  ) {
    if (!status) {
      throw new Error('Status is required.');
    }

    await this.videoUseCase.updateStatus(videoId, status, path);
    return { message: 'Video status updated successfully', videoId };
  }

  @Get(':videoId/download')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename=video.zip')
  async downloadVideo(@Param('videoId') videoId: string) {
    const fileContent = await this.videoUseCase.downloadVideo(videoId);

    if (!fileContent) {
      throw new Error('Failed to retrieve video file.');
    }

    const stream = Readable.from(fileContent);
    return new StreamableFile(stream);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getVideosByUser(@Param('userId') userId: string) {
    if (!userId) {
      throw new Error('userId is required.');
    }

    const videos = await this.videoUseCase.getVideosByUser(userId);
    return videos.map((video) => ({
      videoId: video.id,
      status: video.status,
    }));
  }
}
