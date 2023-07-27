import { NgssmExpressionTreeNodeAction } from './ngssm-expression-tree-node.action';
import { NgssmExpressionTreeActionType } from './ngssm-expression-tree-action-type';
import { CutAndPasteTarget } from '../model';

export class NgssmPasteExpressionTreeNodeAction extends NgssmExpressionTreeNodeAction {
  constructor(
    treeId: string,
    nodeId: string,
    public readonly target: CutAndPasteTarget
  ) {
    super(NgssmExpressionTreeActionType.ngssmPasteExpressionTreeNode, treeId, nodeId);
  }
}
