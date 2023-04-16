import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';

export class NgssmUpdateExpressionTreeNodeAction<TData = any> extends NgssmExpressionTreeNodeAction {
  constructor(treeId: string, nodeId: string, public readonly data: TData) {
    super(NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode, treeId, nodeId);
  }
}
