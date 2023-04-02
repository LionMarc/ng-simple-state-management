import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';

export interface NgssmExpressionTreeDescriptionComponent<TData = any> {
  setNode(value: NgssmExpressionTreeNode<TData>): void;
}
