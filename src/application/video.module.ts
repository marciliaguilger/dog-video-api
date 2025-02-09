import { Module } from '@nestjs/common';
import { VideoController } from './controller/video.controller';
import { IVideoUseCase } from 'src/domain/use-cases/video/video-use-case.interface';
import { VideoUseCase } from 'src/domain/use-cases/video/video-use-case.service';
import { VideoRepository } from 'src/infrastucture/data/repositories/video.repository';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { DynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb.repository';
import { IDynamoDbRepository } from 'src/infrastucture/data/repositories/dynamodb-repository.interface';
import { UserRepository } from 'src/infrastucture/data/repositories/user.repository';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { S3Repository } from 'src/infrastucture/data/repositories/s3.repository';
import { IS3Repository } from 'src/infrastucture/data/repositories/s3-repository.interface';
import { MessageProducerRepository } from 'src/infrastucture/data/repositories/sqs.repository';
import { IMessageProducerRepository } from 'src/infrastucture/data/repositories/sqs.repository.interface';

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
    UserRepository,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    DynamoDbRepository,
    {
      provide: IDynamoDbRepository,
      useFactory: () => new DynamoDbRepository('videos'),
      useClass: DynamoDbRepository,
    },
    S3Repository,
    {
      provide: IS3Repository,
      useClass: S3Repository,
    },
    MessageProducerRepository,
    {
      provide: IMessageProducerRepository,
      useClass: MessageProducerRepository,
    },
  ],
})
export class VideoModule {}
