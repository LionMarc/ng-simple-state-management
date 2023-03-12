export interface NgssmNode<TData = any> {
  id: string;
  parentId?: string;
  isExpandable?: boolean;
  data: TData;
}
