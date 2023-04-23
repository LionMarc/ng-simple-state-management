import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import {
  NgssmAddExpressionTreeNodeAction,
  NgssmAddExpressionTreeNodesAction,
  NgssmDeleteExpressionTreeNodeAction,
  NgssmExpressionTreeActionType,
  NgssmUpdateExpressionTreeNodeAction
} from '../actions';
import { selectNgssmExpressionTreeState, updateNgssmExpressionTreeState } from '../state';
import { NgssmExpressionTreeData, NgssmExpressionTreeNode, NgssmNode } from '../model';

@Injectable()
export class TreeNodeEditionReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmAddExpressionTreeNodes
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode: {
        const ngssmAddExpressionTreeNodeAction = action as NgssmAddExpressionTreeNodeAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmAddExpressionTreeNodeAction.treeId]: {
              data: {
                [ngssmAddExpressionTreeNodeAction.node.id]: { $set: ngssmAddExpressionTreeNodeAction.node.data }
              },
              nodes: {
                $apply: (values: NgssmExpressionTreeNode[]) => {
                  const output: NgssmExpressionTreeNode[] = [...values];
                  this.addNodeToList(ngssmAddExpressionTreeNodeAction.node, output);
                  return output;
                }
              }
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmAddExpressionTreeNodes: {
        const ngssmAddExpressionTreeNodesAction = action as NgssmAddExpressionTreeNodesAction;
        const newProps: NgssmExpressionTreeData = {};
        ngssmAddExpressionTreeNodesAction.nodes.forEach((node) => (newProps[node.id] = node.data));
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmAddExpressionTreeNodesAction.treeId]: {
              data: { $merge: newProps },
              nodes: {
                $apply: (values: NgssmExpressionTreeNode[]) => {
                  const output: NgssmExpressionTreeNode[] = [...values];
                  ngssmAddExpressionTreeNodesAction.nodes.forEach((node) => this.addNodeToList(node, output));
                  return output;
                }
              }
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode: {
        const ngssmDeleteExpressionTreeNodeAction = action as NgssmDeleteExpressionTreeNodeAction;
        const nodeIdsToDelete: string[] = selectNgssmExpressionTreeState(state)
          .trees[ngssmDeleteExpressionTreeNodeAction.treeId].nodes.filter((n) =>
            n.path.includes(ngssmDeleteExpressionTreeNodeAction.nodeId)
          )
          .map((n) => n.data.id);
        nodeIdsToDelete.push(ngssmDeleteExpressionTreeNodeAction.nodeId);
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmDeleteExpressionTreeNodeAction.treeId]: {
              nodes: { $apply: (values: NgssmExpressionTreeNode[]) => values.filter((v) => !nodeIdsToDelete.includes(v.data.id)) },
              data: { $unset: nodeIdsToDelete }
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode: {
        const ngssmUpdateExpressionTreeNodeAction = action as NgssmUpdateExpressionTreeNodeAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmUpdateExpressionTreeNodeAction.treeId]: {
              data: {
                [ngssmUpdateExpressionTreeNodeAction.nodeId]: { $set: ngssmUpdateExpressionTreeNodeAction.data }
              }
            }
          }
        });
      }
    }

    return state;
  }

  private addNodeToList(node: NgssmNode, nodeList: NgssmExpressionTreeNode[]): void {
    if (node.parentId === undefined) {
      nodeList.push({
        path: [],
        data: node,
        isExpanded: true
      });
      return;
    }

    let parentNode: NgssmExpressionTreeNode | undefined;
    let insertionIndex = -1;
    for (let i = 0; i < nodeList.length; i++) {
      if (parentNode) {
        if (nodeList[i].path.includes(node.parentId)) {
          insertionIndex = i + 1;
        } else {
          break;
        }

        continue;
      }

      if (nodeList[i].data.id === node.parentId) {
        parentNode = nodeList[i];
        insertionIndex = i + 1;
        continue;
      }
    }

    if (!parentNode || insertionIndex === -1) {
      throw new Error('Invalid parent id');
    }

    nodeList.splice(insertionIndex, 0, {
      path: [...parentNode.path, parentNode.data.id],
      data: node,
      isExpanded: true
    });
  }
}

export const treeNodeEditionReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreeNodeEditionReducer,
  multi: true
};
