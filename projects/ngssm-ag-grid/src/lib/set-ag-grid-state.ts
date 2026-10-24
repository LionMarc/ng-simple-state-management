import { Action, ReducerFunc } from 'ngssm-store';

import { ColumnState, FilterModel } from 'ag-grid-community';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, ColumnGroupState, updateNgssmAgGridState } from './state';

export class NgssmSetAgGridStateAction implements Action {
  public readonly type: string = NgssmAgGridActionType.setAgGridState;

  constructor(
    public readonly gridId: string,
    public readonly origin: ChangeOrigin,
    public readonly columnStates: ColumnState[],
    public readonly columnGroupStates: ColumnGroupState[],
    public readonly filterModel: FilterModel | null
  ) {}
}

export const setAgGridState: ReducerFunc<NgssmSetAgGridStateAction> = (state, action) => {
  return updateNgssmAgGridState(state, {
    gridStates: {
      [action.gridId]: {
        $set: {
          origin: action.origin,
          columnStates: action.columnStates,
          columnGroupStates: action.columnGroupStates,
          filterModel: action.filterModel
        }
      }
    }
  });
};
