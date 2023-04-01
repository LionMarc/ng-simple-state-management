import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeNodeAction } from './tree-node-action';

export class ExpandNodeAction extends TreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmTreeActionType.expandNode, treeId, nodeId);
  }
}
