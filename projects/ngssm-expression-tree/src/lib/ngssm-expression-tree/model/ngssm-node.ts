export interface NgssmNode<TData = any> {
  id: string;
  parentId?: string;
  data: TData;
}
