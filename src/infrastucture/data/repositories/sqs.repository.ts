import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

@Injectable()
export class MessageProducerRepository {
  private readonly sqs: AWS.SQS;

  constructor(private readonly sqsService: SqsService) {
    this.sqs = new AWS.SQS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async sendMessage(body: string) {
    const message = {
      id: `${Date.now()}`, // Exemplo de ID único para a mensagem
      body: body, // A propriedade body deve conter o conteúdo da mensagem
    };

    try {
      await this.sqsService.send(process.env.QUEUE_NAME, message);
    } catch (error) {
      console.error('Error in producing message!', error);
      console.error('SqsService:', this.sqsService);
    }
  }

  async send(messageBody: string): Promise<void> {
    const params = {
      QueueUrl: process.env.QUEUE_NAME,
      MessageBody: messageBody,
    };

    return new Promise((resolve, reject) => {
      this.sqs.sendMessage(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('Message sent successfully:', data.MessageId);
          resolve();
        }
      });
    });
  }
}
