import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';

export class NgssmCutExpressionTreeNodeAction extends NgssmExpressionTreeNodeAction {
  constructor(treeId: string, nodeId: string) {
    super(NgssmExpressionTreeActionType.ngssmCutExpressionTreeNode, treeId, nodeId);
  }
}
