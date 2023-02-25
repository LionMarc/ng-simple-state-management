import { Action } from 'ngssm-store';
import { NgssmTreeActionType } from './ngssm-tree-action-type';

export class SearchTreeNodesAction implements Action {
  public readonly type: string = NgssmTreeActionType.searchTreeNodes;

  constructor(public readonly searchPattern: string) {}
}
