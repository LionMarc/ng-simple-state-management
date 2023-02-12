import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeAction } from './tree-action';

export class ExpandNodeAction extends TreeAction {
  constructor(treeId: string, public readonly nodeId: string) {
    super(NgssmTreeActionType.expandNode, treeId);
  }
}
