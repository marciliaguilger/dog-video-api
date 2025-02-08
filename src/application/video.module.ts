import { Module } from '@nestjs/common';
import { VideoController } from './controller/video.controller';
import { IVideoUseCase } from 'src/domain/use-cases/video/video-use-case.interface';
import { VideoUseCase } from 'src/domain/use-cases/video/video-use-case.service';
import { VideoRepository } from 'src/infrastucture/data/repositories/video.repository';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { DynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb.repository';
import { IDynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb-repository.interface';

@Module({
  imports: [],
  controllers: [VideoController],
  providers: [
    VideoUseCase,
    {
      provide: IVideoUseCase,
      useClass: VideoUseCase,
    },
    VideoRepository,
    {
      provide: IVideoRepository,
      useClass: VideoRepository,
    },
    DynamoDbRepository,
    {
      provide: IDynamoDbRepository,
      useFactory: () => new DynamoDbRepository('videos'),
      useClass: DynamoDbRepository,
    },
  ],
})
export class VideoModule {}
