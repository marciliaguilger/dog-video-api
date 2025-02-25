import * as AWS from 'aws-sdk';
import { IS3Repository } from './s3-repository.interface';

export class S3Repository implements IS3Repository {
  private readonly AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || '';
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, path: string) {
    if (!file) {
      throw new Error('File is required for upload.');
    }

    return await this.s3Upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      path,
      file.mimetype,
    );
  }

  async downloadFile(key: string): Promise<string> {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: key,
      Expires: 3600, // 1 hour by default
    };

    try {
      const data = await this.s3.getSignedUrlPromise('getObject', params);
      return data;
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw error;
    }
  }

  private async s3Upload(
    file: Buffer,
    bucket: string,
    key: string,
    mimetype: string,
  ) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
