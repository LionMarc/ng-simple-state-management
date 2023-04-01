import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';

export class NgssmCollapseExpressionTreeNodeAction extends NgssmExpressionTreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode, treeId, nodeId);
  }
}
