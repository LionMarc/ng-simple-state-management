import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';
import { NgssmNode } from './ngssm-node';

export interface NgssmExpressionTree<TData = any> {
  nodes: NgssmExpressionTreeNode<TData>[];
}

export const createNgssmExpressionTreeFromNodes = <TData = any>(nodes: NgssmNode<TData>[]): NgssmExpressionTree<TData> => {
  const tree: NgssmExpressionTree<TData> = {
    nodes: []
  };

  let path: string[] = [];
  nodes.forEach((node) => {
    if (!node.parentId) {
      path = [];
    } else {
      const parentIdIndex = path.indexOf(node.parentId);
      if (parentIdIndex === -1) {
        path.push(node.parentId);
      } else {
        path.splice(parentIdIndex + 1);
      }
    }

    tree.nodes.push({
      path: [...path],
      data: node,
      isExpanded: node.isExpandable === true
    });
  });

  return tree;
};
