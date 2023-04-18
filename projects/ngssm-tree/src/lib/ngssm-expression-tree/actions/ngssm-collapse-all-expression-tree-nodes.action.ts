import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';

export class NgssmCollapseAllExpressionTreeNodesAction extends NgssmExpressionTreeAction {
  constructor(treeId: string) {
    super(NgssmExpressionTreeActionType.ngssmCollapseAllExpressionTreeNodes, treeId);
  }
}
