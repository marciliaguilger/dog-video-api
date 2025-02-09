import { Module } from '@nestjs/common';
import { VideoController } from './controller/video.controller';
import { IVideoUseCase } from 'src/domain/use-cases/video/video-use-case.interface';
import { VideoUseCase } from 'src/domain/use-cases/video/video-use-case.service';
import { VideoRepository } from 'src/infrastucture/data/repositories/video.repository';
import { IVideoRepository } from 'src/domain/repositories/video/video-repository.interface';
import { DynamoDbVideosRepository } from 'src/infrastucture/data/repositories/dynamodb-videos.repository';
import { UserRepository } from 'src/infrastucture/data/repositories/user.repository';
import { IUserRepository } from 'src/domain/repositories/user/user-repository.interface';
import { S3Repository } from 'src/infrastucture/data/repositories/s3.repository';
import { IS3Repository } from 'src/infrastucture/data/repositories/s3-repository.interface';
import { MessageProducerRepository } from 'src/infrastucture/data/repositories/sqs.repository';
import { IMessageProducerRepository } from 'src/infrastucture/data/repositories/sqs.repository.interface';
import { IDynamoDbVideosRepository } from 'src/infrastucture/data/repositories/dynamodb-videos-repository.interface';
import { DynamoDbUsersRepository } from 'src/infrastucture/data/repositories/dynamodb-users.repository';
import { IDynamoDbUsersRepository } from 'src/infrastucture/data/repositories/dynamodb-users-repository.interface';

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
    DynamoDbVideosRepository,
    {
      provide: IDynamoDbVideosRepository,
      useClass: DynamoDbVideosRepository,
    },
    DynamoDbUsersRepository,
    {
      provide: IDynamoDbUsersRepository,
      useClass: DynamoDbUsersRepository,
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
