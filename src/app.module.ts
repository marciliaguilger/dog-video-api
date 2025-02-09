import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { VideoModule } from './application/video.module';
import { UserModule } from './application/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UserModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
