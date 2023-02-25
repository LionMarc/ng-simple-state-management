import { Action } from 'ngssm-store';

import { NgssmTreeNode } from '../model';
import { NgssmTreeActionType } from './ngssm-tree-action-type';

export class RegisterPartialSearchResultsAction implements Action {
  public readonly type: string = NgssmTreeActionType.registerPartialSearchResults;

  constructor(public readonly matchingNodes: NgssmTreeNode[], public nodesToProcess: NgssmTreeNode[]) {}
}
