import { Injectable, Provider } from '@angular/core';

import update from 'immutability-helper';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import {
  NgssmCollapseAllExpressionTreeNodesAction,
  NgssmCollapseExpressionTreeNodeAction,
  NgssmExpandAllExpressionTreeNodesAction,
  NgssmExpandExpressionTreeNodeAction,
  NgssmExpressionTreeActionType
} from '../actions';
import { NgssmExpressionTreeNode } from '../model';
import { updateNgssmExpressionTreeState } from '../state';

@Injectable()
export class TreeNodeExpandReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmCollapseAllExpressionTreeNodes,
    NgssmExpressionTreeActionType.ngssmExpandAllExpressionTreeNodes
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode: {
        const ngssmExpandExpressionTreeNodeAction = action as NgssmExpandExpressionTreeNodeAction;
        return this.setIsExpanded(state, ngssmExpandExpressionTreeNodeAction.treeId, ngssmExpandExpressionTreeNodeAction.nodeId, true);
      }

      case NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode: {
        const ngssmCollapseExpressionTreeNodeAction = action as NgssmCollapseExpressionTreeNodeAction;
        return this.setIsExpanded(state, ngssmCollapseExpressionTreeNodeAction.treeId, ngssmCollapseExpressionTreeNodeAction.nodeId, false);
      }

      case NgssmExpressionTreeActionType.ngssmCollapseAllExpressionTreeNodes: {
        const ngssmExpressionTreeAction = action as NgssmCollapseAllExpressionTreeNodesAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmExpressionTreeAction.treeId]: {
              nodes: {
                $apply: (values: NgssmExpressionTreeNode[]) => {
                  const output: NgssmExpressionTreeNode[] = [];
                  values.forEach((value) =>
                    output.push({
                      ...value,
                      isExpanded: false
                    })
                  );

                  return output;
                }
              }
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmExpandAllExpressionTreeNodes: {
        const ngssmExpressionTreeAction = action as NgssmExpandAllExpressionTreeNodesAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmExpressionTreeAction.treeId]: {
              nodes: {
                $apply: (values: NgssmExpressionTreeNode[]) => {
                  const output: NgssmExpressionTreeNode[] = [];
                  values.forEach((value) =>
                    output.push({
                      ...value,
                      isExpanded: true
                    })
                  );

                  return output;
                }
              }
            }
          }
        });
      }
    }

    return state;
  }

  private setIsExpanded(state: State, treeId: string, nodeId: string, isExpanded: boolean): State {
    return updateNgssmExpressionTreeState(state, {
      trees: {
        [treeId]: {
          nodes: {
            $apply: (values: NgssmExpressionTreeNode[]) => {
              const output = [...values];
              const index = output.findIndex((n) => n.data.id === nodeId);
              if (index !== -1) {
                output.splice(index, 1, update(output[index], { isExpanded: { $set: isExpanded } }));
              }

              return output;
            }
          }
        }
      }
    });
  }
}

export const treeNodeExpandReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreeNodeExpandReducer,
  multi: true
};
