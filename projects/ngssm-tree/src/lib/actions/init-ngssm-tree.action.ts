import { Action } from 'ngssm-store';

import { NodeData } from '../model';
import { NgssmTreeActionType } from './ngssm-tree-action-type';

export class InitNgssmTreeAction implements Action {
  public readonly type: string = NgssmTreeActionType.initNgssmTree;

  constructor(public readonly treeId: string, public readonly root: NodeData) {}
}
