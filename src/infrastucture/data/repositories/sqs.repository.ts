import { SqsService } from '@ssut/nestjs-sqs';

export class MessageProducerRepository {
  constructor(private readonly sqsService: SqsService) {}
  async sendMessage(body: string) {
    const message: any = JSON.stringify(body);

    try {
      await this.sqsService.send(process.env.QUEUE_NAME, message);
    } catch (error) {
      console.log('error in producing message!', error);
    }
  }
}
