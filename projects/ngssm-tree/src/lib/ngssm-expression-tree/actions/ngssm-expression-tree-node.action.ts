import { NgssmExpressionTreeAction } from './ngssm-expression-tree.action';

export class NgssmExpressionTreeNodeAction extends NgssmExpressionTreeAction {
  constructor(
    type: string,
    treeId: string,
    public readonly nodeId: string
  ) {
    super(type, treeId);
  }
}
