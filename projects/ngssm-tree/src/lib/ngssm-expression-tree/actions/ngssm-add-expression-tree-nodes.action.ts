import { NgssmNode } from '../model';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';

export class NgssmAddExpressionTreeNodesAction<TData = unknown> extends NgssmExpressionTreeAction {
  constructor(
    treeId: string,
    public readonly nodes: NgssmNode<TData>[]
  ) {
    super(NgssmExpressionTreeActionType.ngssmAddExpressionTreeNodes, treeId);
  }
}
