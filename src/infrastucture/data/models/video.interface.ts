export interface VideoModel {
  id: string;
  userId: string;
  status: string;
  videoPathToBucket: string;
  slicedVideoPathToBucket?: string;
}
