import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { VideoModule } from './application/video.module';
import { UserModule } from './application/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UserModule,
    VideoModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
    }),
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: process.env.QUEUE_NAME,
          queueUrl: process.env.QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
