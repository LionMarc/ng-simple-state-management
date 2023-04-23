export enum NgssmExpressionTreeActionType {
  // List of trees management
  ngssmInitExpressionTree = '[NgssmExpressionTreeActionType] ngssmInitExpressionTree',
  ngssmClearExpressionTree = '[NgssmExpressionTreeActionType] ngssmClearExpressionTree',

  // Manage expand/collapse
  ngssmCollapseExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmCollapseExpressionTreeNode',
  ngssmExpandExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmExpandExpressionTreeNode',
  ngssmCollapseAllExpressionTreeNodes = '[NgssmExpressionTreeActionType] ngssmCollapseAllExpressionTreeNodes',
  ngssmExpandAllExpressionTreeNodes = '[NgssmExpressionTreeActionType] ngssmExpandAllExpressionTreeNodes',

  // Node edition
  ngssmAddExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmAddExpressionTreeNode',
  ngssmAddExpressionTreeNodes = '[NgssmExpressionTreeActionType] ngssmAddExpressionTreeNodes',
  ngssmDeleteExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmDeleteExpressionTreeNode',
  ngssmUpdateExpressionTreeNode = '[NgssmExpressionTreeActionType] ngssmUpdateExpressionTreeNode'
}
