import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';

export class NgssmExpandExpressionTreeNodeAction extends NgssmExpressionTreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode, treeId, nodeId);
  }
}
