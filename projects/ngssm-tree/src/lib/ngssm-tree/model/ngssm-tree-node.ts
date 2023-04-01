import { DataStatus } from 'ngssm-remote-data';
import { NodeData } from './node-data';

export interface NgssmTreeNode {
  status: DataStatus;
  isExpanded?: boolean;
  level: number;
  parentFullPath?: string;

  node: NodeData;
}

export const getNgssmTreeNodeFullPath = (node: NgssmTreeNode): string => {
  if (node.parentFullPath) {
    return `${node.parentFullPath}/${node.node.label}`;
  }

  return node.node.label;
};
