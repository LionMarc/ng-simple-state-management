import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';

export class NgssmCancelCutExpressionTreeNodeAction extends NgssmExpressionTreeAction {
  constructor(treeId: string) {
    super(NgssmExpressionTreeActionType.ngssmCancelCutExpressionTreeNode, treeId);
  }
}
