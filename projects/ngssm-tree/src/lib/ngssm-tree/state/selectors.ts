import { State } from 'ngssm-store';
import { NgssmTreeNode } from '../model';
import { selectNgssmTreeState } from './ngssm-tree.state';

export const selectNgssmTreeNode = (state: State, treeId: string, nodeId: string): NgssmTreeNode | undefined =>
  selectNgssmTreeState(state).trees[treeId]?.nodes.find((n) => n.node.nodeId === nodeId);

export const selectNgssmTreeNodeChildren = (state: State, treeId: string, nodeId: string): NgssmTreeNode[] =>
  selectNgssmTreeState(state).trees[treeId]?.nodes.filter((n) => n.node.parentNodeId === nodeId) ?? [];
