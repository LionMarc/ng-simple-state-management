import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';

export interface NgssmExpressionTreeDescriptionComponent<TData = any> {
  setNode(node: NgssmExpressionTreeNode<TData>, data: TData): void;
}
