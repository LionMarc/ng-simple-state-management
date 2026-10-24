import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, updateNgssmAgGridState } from './state';

export class NgssmClearSelectedRowsAction implements Action {
  public readonly type: string = NgssmAgGridActionType.clearSelectedRows;

  constructor(public readonly gridId: string) {}
}

export const clearSelectedRows: ReducerFunc<NgssmClearSelectedRowsAction> = (state, action) => {
  return updateNgssmAgGridState(state, {
    selectedRows: {
      [action.gridId]: {
        $set: {
          origin: ChangeOrigin.other,
          ids: []
        }
      }
    }
  });
};
