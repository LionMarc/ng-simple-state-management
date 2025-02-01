import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { AgGridActionType, RegisterAgGridStateAction } from '../actions';
import { updateAgGridState } from '../state';

@Injectable()
export class GridStatesReducer implements Reducer {
  public readonly processedActions: string[] = [AgGridActionType.registerAgGridState];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case AgGridActionType.registerAgGridState: {
        const registerAgGridStateAction = action as RegisterAgGridStateAction;
        return updateAgGridState(state, {
          gridStates: {
            [registerAgGridStateAction.gridId]: {
              $set: {
                origin: registerAgGridStateAction.origin,
                columnsState: registerAgGridStateAction.columnStates
              }
            }
          }
        });
      }
    }

    return state;
  }
}
