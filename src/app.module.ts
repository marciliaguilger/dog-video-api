import { Module } from '@nestjs/common';
import { VideoModule } from './application/video.module';
import { UserModule } from './application/user.module';

@Module({
  imports: [UserModule, VideoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
