import { NgssmTreeNode } from './ngssm-tree-node';

export interface NgssmTree {
  nodes: NgssmTreeNode[];
  selectedNode?: string;
}
