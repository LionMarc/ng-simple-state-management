import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmTreeActionType, SelectNodeAction } from '../actions';
import { updateNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeSelectionReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmTreeActionType.selectNode];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.selectNode: {
        const selectNodeAction = action as SelectNodeAction;
        return updateNgssmTreeState(state, {
          trees: {
            [selectNodeAction.treeId]: {
              selectedNode: { $set: selectNodeAction.nodeId }
            }
          }
        });
      }
    }

    return state;
  }
}
