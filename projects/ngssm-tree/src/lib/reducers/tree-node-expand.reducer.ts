import { Injectable, Provider } from '@angular/core';

import update from 'immutability-helper';

import { DataStatus } from 'ngssm-remote-data';
import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { CollapseNodeAction, ExpandNodeAction, NgssmTreeActionType, SelectNodeAction } from '../actions';
import { NgssmTreeNode } from '../model';
import { selectNgssmTreeState, updateNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeExpandReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmTreeActionType.expandNode,
    NgssmTreeActionType.collapseNode,
    NgssmTreeActionType.selectNode
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.expandNode: {
        const expandNodeAction = action as ExpandNodeAction;
        return updateNgssmTreeState(state, {
          trees: {
            [expandNodeAction.treeId]: {
              nodes: {
                $apply: (nodes: NgssmTreeNode[]) => {
                  const result = [...nodes];
                  const index = result.findIndex((n) => n.node.nodeId === expandNodeAction.nodeId);
                  if (index !== -1) {
                    let item = result[index];
                    if (item.status === DataStatus.loaded) {
                      item = update(result[index], {
                        isExpanded: { $set: true }
                      });
                    } else {
                      item = update(result[index], {
                        isExpanded: { $set: true },
                        status: { $set: DataStatus.loading }
                      });
                    }

                    result.splice(index, 1, item);
                  }

                  return result;
                }
              }
            }
          }
        });
      }

      case NgssmTreeActionType.collapseNode: {
        const collapseNodeAction = action as CollapseNodeAction;
        return updateNgssmTreeState(state, {
          trees: {
            [collapseNodeAction.treeId]: {
              nodes: {
                $apply: (nodes: NgssmTreeNode[]) => {
                  const result = [...nodes];
                  const index = result.findIndex((n) => n.node.nodeId === collapseNodeAction.nodeId);
                  if (index !== -1) {
                    const item = update(result[index], {
                      isExpanded: { $set: false }
                    });

                    result.splice(index, 1, item);
                  }

                  return result;
                }
              }
            }
          }
        });
      }

      case NgssmTreeActionType.selectNode: {
        const selectNodeAction = action as SelectNodeAction;
        if (
          selectNgssmTreeState(state).trees[selectNodeAction.treeId].nodes.find((n) => n.node.nodeId === selectNodeAction.nodeId)
            ?.status === DataStatus.loaded
        ) {
          break;
        }

        return updateNgssmTreeState(state, {
          trees: {
            [selectNodeAction.treeId]: {
              nodes: {
                $apply: (nodes: NgssmTreeNode[]) => {
                  const result = [...nodes];
                  const index = result.findIndex((n) => n.node.nodeId === selectNodeAction.nodeId);
                  if (index !== -1) {
                    const item = update(result[index], {
                      status: { $set: DataStatus.loading }
                    });

                    result.splice(index, 1, item);
                  }

                  return result;
                }
              }
            }
          }
        });
      }
    }

    return state;
  }
}

export const treeNodeExpandReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreeNodeExpandReducer,
  multi: true
};
