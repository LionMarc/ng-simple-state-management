import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { AgGridActionType, RegisterSelectedRowsAction } from '../actions';
import { updateAgGridState } from '../state';

@Injectable()
export class SelectedRowsReducer implements Reducer {
  public readonly processedActions: string[] = [AgGridActionType.registerSelectedRows];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case AgGridActionType.registerSelectedRows:
        const registerSelectedRowsAction = action as RegisterSelectedRowsAction;
        return updateAgGridState(state, {
          selectedRows: {
            [registerSelectedRowsAction.gridId]: {
              $set: {
                origin: registerSelectedRowsAction.origin,
                ids: registerSelectedRowsAction.ids
              }
            }
          }
        });
    }

    return state;
  }
}

export const selectedRowsReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: SelectedRowsReducer,
  multi: true
};
