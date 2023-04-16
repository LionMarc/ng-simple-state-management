export enum NgssmExpressionTreeActionType {
  // List of trees management
  ngssmInitExpressionTree = '[NgssmExpressionTreeActionType] ngssmInitExpressionTree',
  ngssmClearExpressionTree = '[NgssmExpressionTreeActionType] ngssmClearExpressionTree',

  // Manage expand/collapse
  ngssmCollapseExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmCollapseExpressionTreeNode',
  ngssmExpandExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmExpandExpressionTreeNode',

  // Node edition
  ngssmAddExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmAddExpressionTreeNode',
  ngssmDeleteExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmDeleteExpressionTreeNode',
  ngssmUpdateExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmUpdateExpressionTreeNode'
}
