import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import {
  NgssmAddExpressionTreeNodeAction,
  NgssmDeleteExpressionTreeNodeAction,
  NgssmExpressionTreeActionType,
  NgssmUpdateExpressionTreeNodeAction
} from '../actions';
import { selectNgssmExpressionTreeState, updateNgssmExpressionTreeState } from '../state';
import { NgssmExpressionTreeNode } from '../model';

@Injectable()
export class TreeNodeEditionReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode
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
                  if (ngssmAddExpressionTreeNodeAction.node.parentId === undefined) {
                    output.push({
                      path: [],
                      data: ngssmAddExpressionTreeNodeAction.node,
                      isExpanded: true
                    });
                    return output;
                  }

                  let parentNode: NgssmExpressionTreeNode | undefined;
                  let insertionIndex = -1;
                  for (let i = 0; i < output.length; i++) {
                    if (parentNode) {
                      if (output[i].path.includes(ngssmAddExpressionTreeNodeAction.node.parentId)) {
                        insertionIndex = i + 1;
                      } else {
                        break;
                      }

                      continue;
                    }

                    if (output[i].data.id === ngssmAddExpressionTreeNodeAction.node.parentId) {
                      parentNode = output[i];
                      insertionIndex = i + 1;
                      continue;
                    }
                  }

                  if (!parentNode || insertionIndex === -1) {
                    throw new Error('Invalid parent id');
                  }

                  output.splice(insertionIndex, 0, {
                    path: [...parentNode.path, parentNode.data.id],
                    data: ngssmAddExpressionTreeNodeAction.node,
                    isExpanded: true
                  });

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
}

export const treeNodeEditionReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreeNodeEditionReducer,
  multi: true
};
