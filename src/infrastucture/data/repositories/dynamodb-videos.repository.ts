import { Item } from 'aws-sdk/clients/simpledb';
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
import { IDynamoDbVideosRepository } from './dynamodb-videos-repository.interface';

export class DynamoDbVideosRepository implements IDynamoDbVideosRepository {
  private readonly tableName: 'videos';
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
      TableName: 'videos',
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
    await this.dynamoDb.send(command);
  }

  async read(id: string): Promise<Item | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });
    const result = await this.dynamoDb.send(command);
    return (result.Item as Item) || null;
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

  async update(id: string, updates: { [key: string]: any }): Promise<void> {
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
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributes,
      ExpressionAttributeValues: expressionAttributes,
    });

    await this.dynamoDb.send(command);
  }
}

function convertToUserItem(record: Record<string, AttributeValue>): UserModel {
  return {
    id: record.id.S!,
    email: record.email.S!,
    password: record.password.S!,
  };
}

function convertToVideoItem(
  record: Record<string, AttributeValue>,
): VideoModel {
  return {
    id: record.id.S!,
    userId: record.userId.S!,
    status: record.status.S!,
    videoPathToBucket: record.videoPathToBucket.S!,
    slicedVideoPathToBucket: record.slicedVideoPathToBucket.S!,
  };
}
