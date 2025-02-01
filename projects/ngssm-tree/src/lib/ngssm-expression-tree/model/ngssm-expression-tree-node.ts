import { NgssmNode } from './ngssm-node';

export interface NgssmExpressionTreeNode<TData = unknown> {
  path: string[];
  data: NgssmNode<TData>;
  isExpanded: boolean;
}
