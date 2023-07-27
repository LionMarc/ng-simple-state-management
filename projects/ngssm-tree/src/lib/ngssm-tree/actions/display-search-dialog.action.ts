import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeAction } from './tree-action';

export class DisplaySearchDialogAction extends TreeAction {
  constructor(
    treeId: string,
    public readonly startNodeId: string
  ) {
    super(NgssmTreeActionType.displaySearchDialog, treeId);
  }
}
