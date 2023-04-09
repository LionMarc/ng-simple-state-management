export interface NgssmExpressionTreeCustomComponent<TData = any> {
  setup(treeId: string, nodeId: string): void;
}
