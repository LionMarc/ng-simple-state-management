import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, updateNgssmAgGridState } from './state';

export class NgssmSetSelectedRowsAction implements Action {
  public readonly type: string = NgssmAgGridActionType.setSelectedRows;

  constructor(
    public readonly gridId: string,
    public readonly origin: ChangeOrigin,
    public readonly ids: string[]
  ) {}
}

export const setSelectedRows: ReducerFunc<NgssmSetSelectedRowsAction> = (state, action) => {
  return updateNgssmAgGridState(state, {
    selectedRows: {
      [action.gridId]: {
        $set: {
          origin: action.origin,
          ids: action.ids
        }
      }
    }
  });
};
