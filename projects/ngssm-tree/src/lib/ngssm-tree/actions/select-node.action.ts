import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeNodeAction } from './tree-node-action';

export class SelectNodeAction extends TreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmTreeActionType.selectNode, treeId, nodeId);
  }
}
