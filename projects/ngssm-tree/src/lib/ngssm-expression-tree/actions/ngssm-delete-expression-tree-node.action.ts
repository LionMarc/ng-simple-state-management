import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';

export class NgssmDeleteExpressionTreeNodeAction extends NgssmExpressionTreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode, treeId, nodeId);
  }
}
