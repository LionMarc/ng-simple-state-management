import { Injectable } from '@angular/core';
import { DataStatus } from 'ngssm-remote-data';

import { Reducer, State, Action } from 'ngssm-store';

import { DeleteNgssmTreeAction, InitNgssmTreeAction, NgssmTreeActionType } from '../actions';
import { updateNgssmTreeState } from '../state';

@Injectable()
export class TreesReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmTreeActionType.initNgssmTree, NgssmTreeActionType.deleteNgssmTree];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.initNgssmTree: {
        const initNgssmTreeAction = action as InitNgssmTreeAction;
        return updateNgssmTreeState(state, {
          trees: {
            [initNgssmTreeAction.treeId]: {
              $set: {
                nodes: [
                  {
                    status: DataStatus.none,
                    isExpanded: false,
                    level: 0,
                    node: initNgssmTreeAction.root
                  }
                ],
                type: initNgssmTreeAction.treeType
              }
            }
          }
        });
      }

      case NgssmTreeActionType.deleteNgssmTree: {
        const deleteNgssmTreeAction = action as DeleteNgssmTreeAction;
        return updateNgssmTreeState(state, {
          trees: { $unset: [deleteNgssmTreeAction.treeId] }
        });
      }
    }

    return state;
  }
}
