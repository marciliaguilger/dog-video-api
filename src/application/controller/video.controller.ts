import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domain/use-cases/auth/jwt-auth.guard';
import { IVideoUseCase } from 'src/domain/use-cases/video/video-use-case.interface';
import { Response } from 'express';

@ApiTags('Video')
@Controller('videos')
export class VideoController {
  constructor(
    @Inject(IVideoUseCase)
    private readonly videoUseCase: IVideoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!userId || !file) {
      throw new Error('userId and video file are required.');
    }

    const result = await this.videoUseCase.processVideo(userId, file);
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
  async downloadVideo(@Param('videoId') videoId: string, @Res() res: Response) {
    try {
      const video = await this.videoUseCase.downloadVideo(videoId);

      if (!video) {
        throw new NotFoundException('Video not found.');
      }

      res.set({
        'Content-Type': video.ContentType,
        'Content-Disposition': `attachment; filename="${videoId}"`,
      });
      res.send(video);
    } catch (error) {
      res.status(500).send(`Error in downloading file: ${error}`);
    }
  }

  @UseGuards(JwtAuthGuard)
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
