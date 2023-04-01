import { DataStatus } from 'ngssm-remote-data';
import { Action } from 'ngssm-store';

import { NodeData } from '../model';
import { NgssmTreeActionType } from './ngssm-tree-action-type';

export class RegisterNodesAction implements Action {
  public readonly type: string = NgssmTreeActionType.registerNodes;

  constructor(
    public readonly dataStatus: DataStatus,
    public readonly treeId: string,
    public readonly parentNodeId: string,
    public readonly nodes: NodeData[] = []
  ) {}
}
