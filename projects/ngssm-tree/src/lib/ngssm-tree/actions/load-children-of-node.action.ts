import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeNodeAction } from './tree-node-action';

export class LoadChildrenOfNodeAction extends TreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmTreeActionType.loadChildrenOfNode, treeId, nodeId);
  }
}
