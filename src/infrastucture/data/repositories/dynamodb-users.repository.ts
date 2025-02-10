import { Item } from 'aws-sdk/clients/simpledb';
import { IDynamoDbUsersRepository } from './dynamodb-users-repository.interface';
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserModel } from '../models/user-item.interface';
import { VideoModel } from '../models/video.interface';

export class DynamoDbUsersRepository implements IDynamoDbUsersRepository {
  private readonly tableName = 'users';
  private readonly dynamoDb: DynamoDBDocumentClient;

  constructor() {
    console.log('Initializing DynamoDB configuration with IRSA');

    console.log('Configured region:', process.env.AWS_REGION);
    console.log('IAM Role ARN:', process.env.AWS_ROLE_ARN);
    console.log(
      'Web Identity Token File:',
      process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
    );

    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);

    this.testConnection();
  }

  async testConnection() {
    const params = {
      TableName: 'users',
    };

    try {
      const data = await this.dynamoDb.send(new ScanCommand(params));
      console.log('Scan items:', data.Items);
    } catch (error) {
      console.error('Error connecting to DynamoDB:', error);
    }
  }

  async create(item: PutItemInputAttributeMap): Promise<void> {
    console.log('create method called');
    console.log(this.dynamoDb.config.credentials);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    console.log('table name:' + this.tableName);
    await this.dynamoDb.send(command);
  }

  async read(userId: string): Promise<UserModel | null> {
    const params = {
      TableName: this.tableName,
      Key: { userId: { S: userId } },
    };

    try {
      const result = await this.dynamoDb.send(new GetCommand(params));
      console.log('read user: ', result);
      return result.Item ? convertToUserItem(result.Item) : null;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': { S: email } },
    };

    try {
      const result = await this.dynamoDb.send(new ScanCommand(params));
      if (result.Items && result.Items.length > 0) {
        return convertToUserItem(result.Items[0]);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findVideosByUserId(userId: string): Promise<VideoModel[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': { S: userId } },
    };

    try {
      const result = await this.dynamoDb.send(new QueryCommand(params));
      return result.Items ? result.Items.map(convertToVideoItem) : [];
    } catch (error) {
      console.error('Error fetching videos for user:', error);
      throw error;
    }
  }

  async update(userId: string, updates: { [key: string]: any }): Promise<void> {
    const expressionAttributes: { [key: string]: any } = {};
    const updateExpressions: string[] = [];

    for (const key in updates) {
      const attributeKey = `#${key}`;
      const valueKey = `:${key}`;

      expressionAttributes[attributeKey] = key;
      expressionAttributes[valueKey] = updates[key];
      updateExpressions.push(`${attributeKey} = ${valueKey}`);
    }

    const updateExpression = `SET ${updateExpressions.join(', ')}`;

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributes,
      ExpressionAttributeValues: expressionAttributes,
    });

    await this.dynamoDb.send(command);
  }
}

function convertToUserItem(record: Record<string, AttributeValue>): UserModel {
  return {
    userId: record.userId.S!,
    email: record.email.S!,
    password: record.password.S!,
  };
}

function convertToVideoItem(
  record: Record<string, AttributeValue>,
): VideoModel {
  return {
    id: record.videoId.S!,
    userId: record.userId.S!,
    status: record.status.S!,
    videoPath: record.videoPath.S!,
    framePath: record.framePath.S!,
  };
}
