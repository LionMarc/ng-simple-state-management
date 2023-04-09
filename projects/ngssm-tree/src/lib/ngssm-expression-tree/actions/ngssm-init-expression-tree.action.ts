import { NgssmNode } from '../model';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';

export class NgssmInitExpressionTreeAction<TData = any> extends NgssmExpressionTreeAction {
  constructor(treeId: string, public readonly nodes: NgssmNode<TData>[]) {
    super(NgssmExpressionTreeActionType.ngssmInitExpressionTree, treeId);
  }
}
