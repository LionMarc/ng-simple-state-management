import { NgssmNode } from './ngssm-node';

export interface NgssmExpressionTreeNode<TData = any> {
  path: string[];
  data: NgssmNode<TData>;
  isExpanded: boolean;
}
