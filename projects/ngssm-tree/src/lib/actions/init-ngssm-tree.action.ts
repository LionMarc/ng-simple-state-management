import { NodeData } from '../model';
import { NgssmTreeActionType } from './ngssm-tree-action-type';
import { TreeAction } from './tree-action';

export class InitNgssmTreeAction extends TreeAction {
  constructor(treeId: string, public readonly treeType: string, public readonly root: NodeData) {
    super(NgssmTreeActionType.initNgssmTree, treeId);
  }
}
