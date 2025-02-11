export interface IS3Repository {
  uploadFile(file: Express.Multer.File, path: string);
  downloadFile(key: string): Promise<AWS.S3.GetObjectOutput>;
}

export const IS3Repository = Symbol('IS3Repository');
