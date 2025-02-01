export interface NodeData<TData = unknown> {
  nodeId: string;
  parentNodeId?: string;
  label: string;
  type: string;
  isExpandable: boolean;

  data?: TData;
}
