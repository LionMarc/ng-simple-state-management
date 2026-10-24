import { EffectFunc } from 'ngssm-store';

import { NgssmAgGridAction } from './ngssm-ag-grid-action-type';
import { selectNgssmAgGridState } from './state';

export const getColumnStatesLocalStorageKey = (gridId: string): string => {
  return `ngssm-ag-grid_${gridId}`;
};

export const getcolumnGroupStatesLocalStorageKey = (gridId: string): string => {
  return `ngssm-ag-grid_groups_${gridId}`;
};

export const getFilterModelLocalStorageKey = (gridId: string): string => {
  return `ngssm-ag-grid_filters_${gridId}`;
};

export const saveColumnStatesOnDisk: EffectFunc<NgssmAgGridAction> = (state, action) => {
  const gridState = selectNgssmAgGridState(state).gridStates[action.gridId];
  if (gridState) {
    localStorage.setItem(getColumnStatesLocalStorageKey(action.gridId), JSON.stringify(gridState.columnStates));
    localStorage.setItem(getcolumnGroupStatesLocalStorageKey(action.gridId), JSON.stringify(gridState.columnGroupStates));
    if (gridState.filterModel) {
      localStorage.setItem(getFilterModelLocalStorageKey(action.gridId), JSON.stringify(gridState.filterModel));
    }
  }
};
