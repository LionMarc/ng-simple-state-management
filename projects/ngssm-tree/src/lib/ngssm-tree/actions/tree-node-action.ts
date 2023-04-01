import { TreeAction } from './tree-action';

export class TreeNodeAction extends TreeAction {
  constructor(actionType: string, treeId: string, public readonly nodeId: string) {
    super(actionType, treeId);
  }
}
