import { UUID } from 'crypto';

export class Video {
  public id: UUID;
  public userId: string;
  public status: string;
  public videoPathToBucket: string;
  public slicedVideoPathToBucket?: string;
}
