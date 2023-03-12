import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';

export interface NgssmExpressionTreeConfig<TData = any> {
  treeId: string;
  nodePadding?: number; // by default 20px
  rowSize?: number; // by default 30px
  getNodeLabel?: (node: NgssmExpressionTreeNode<TData>) => string;
  getNodeDescription?: (node: NgssmExpressionTreeNode<TData>) => string;
}
