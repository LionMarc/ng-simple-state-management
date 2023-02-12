import { Injectable, Provider } from '@angular/core';

import update from 'immutability-helper';

import { DataStatus } from 'ngssm-remote-data';
import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { CollapseNodeAction, ExpandNodeAction, NgssmTreeActionType } from '../actions';
import { NgssmTreeNode } from '../model';
import { updateNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeExpandReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmTreeActionType.expandNode, NgssmTreeActionType.collapseNode];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.expandNode: {
        const expandNodeAction = action as ExpandNodeAction;
        return updateNgssmTreeState(state, {
          trees: {
            [expandNodeAction.treeId]: {
              $apply: (nodes: NgssmTreeNode[]) => {
                const result = [...nodes];
                const index = result.findIndex((n) => n.id === expandNodeAction.nodeId);
                if (index !== -1) {
                  let item = result[index];
                  if (item.status === DataStatus.loaded) {
                    item = update(result[index], {
                      isExpanded: { $set: true }
                    });
                  } else {
                    item = update(result[index], {
                      isExpanded: { $set: undefined },
                      status: { $set: DataStatus.loading }
                    });
                  }

                  result.splice(index, 1, item);
                }

                return result;
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
              $apply: (nodes: NgssmTreeNode[]) => {
                const result = [...nodes];
                const index = result.findIndex((n) => n.id === collapseNodeAction.nodeId);
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
