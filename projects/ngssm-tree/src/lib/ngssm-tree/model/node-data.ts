export interface NodeData<TData = any> {
  nodeId: string;
  parentNodeId?: string;
  label: string;
  type: string;
  isExpandable: boolean;

  data?: TData;
}
