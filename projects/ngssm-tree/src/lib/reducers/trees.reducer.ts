import { Injectable, Provider } from '@angular/core';
import { DataStatus } from 'ngssm-remote-data';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { InitNgssmTreeAction, NgssmTreeActionType } from '../actions';
import { updateNgssmTreeState } from '../state';

@Injectable()
export class TreesReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmTreeActionType.initNgssmTree];

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
                ]
              }
            }
          }
        });
      }
    }

    return state;
  }
}

export const treesReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreesReducer,
  multi: true
};
