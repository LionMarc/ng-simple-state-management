import { NgssmTreeNode } from './ngssm-tree-node';

export interface NgssmTree {
  nodes: NgssmTreeNode[];
  selectedNode?: string;
  type: string;
}

export const getNgssmTreePath = (tree: NgssmTree, nodeId: string): NgssmTreeNode[] => {
  const nodesPerId = new Map<string, NgssmTreeNode>(tree.nodes.map((n) => [n.node.nodeId, n]));
  const path: NgssmTreeNode[] = [];
  let node = nodesPerId.get(nodeId);
  while (node) {
    path.unshift(node);
    node = node.node.parentNodeId ? nodesPerId.get(node.node.parentNodeId) : undefined;
  }

  if (path.length === 0 && tree.nodes.length > 0) {
    path.push(tree.nodes[0]);
  }

  return path;
};
