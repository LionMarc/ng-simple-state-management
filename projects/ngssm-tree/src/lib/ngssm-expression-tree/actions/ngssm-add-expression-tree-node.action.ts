import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmNode } from '../model';

export class NgssmAddExpressionTreeNodeAction<TData = any> extends NgssmExpressionTreeAction {
  constructor(
    treeId: string,
    public readonly node: NgssmNode<TData>
  ) {
    super(NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode, treeId);
  }
}
