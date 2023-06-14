import { NgssmExpressionTreeData } from './ngssm-expression-tree-data';
import { NgssmExpressionTreeNode } from './ngssm-expression-tree-node';
import { NgssmNode } from './ngssm-node';

export interface NgssmExpressionTree<TData = any> {
  nodes: NgssmExpressionTreeNode<TData>[];
  data: NgssmExpressionTreeData<TData>;
  nodeCut?: NgssmExpressionTreeNode<TData>;
}

export const createNgssmExpressionTreeFromNodes = <TData = any>(nodes: NgssmNode<TData>[]): NgssmExpressionTree<TData> => {
  const tree: NgssmExpressionTree<TData> = {
    nodes: [],
    data: {}
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

    tree.data[node.id] = node.data;
  });

  return tree;
};
