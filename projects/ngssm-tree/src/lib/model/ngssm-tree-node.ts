import { DataStatus } from 'ngssm-remote-data';
import { NodeData } from './node-data';

export interface NgssmTreeNode {
  status: DataStatus;
  isExpanded?: boolean;
  level: number;

  node: NodeData;
}
