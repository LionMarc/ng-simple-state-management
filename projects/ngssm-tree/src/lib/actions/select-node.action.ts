import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeAction } from './tree-action';

export class SelectNodeAction extends TreeAction {
  constructor(treeId: string, public readonly nodeId: string) {
    super(NgssmTreeActionType.selectNode, treeId);
  }
}
