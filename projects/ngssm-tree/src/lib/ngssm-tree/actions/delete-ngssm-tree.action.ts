import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeAction } from './tree-action';

export class DeleteNgssmTreeAction extends TreeAction {
  constructor(treeId: string) {
    super(NgssmTreeActionType.deleteNgssmTree, treeId);
  }
}
