import { ColumnState, FilterModel } from 'ag-grid-community';
import { State } from 'ngssm-store';

import { NgssmAgGridAction, NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import {
  getcolumnGroupStatesLocalStorageKey,
  getColumnStatesLocalStorageKey,
  getFilterModelLocalStorageKey,
  saveColumnStatesOnDisk
} from './save-column-states-on-disk';
import { ChangeOrigin, ColumnGroupState, GridState, NgssmAgGridStateSpecification } from './state';

describe('saveColumnStatesOnDisk', () => {
  const gridId = 'testing-grid';

  beforeEach(() => {
    localStorage.clear();
  });

  const createState = (gridState?: GridState): State => ({
    [NgssmAgGridStateSpecification.featureStateKey]: {
      ...NgssmAgGridStateSpecification.initialState,
      gridStates: gridState ? { [gridId]: gridState } : {}
    }
  });

  const save = (state: State) => saveColumnStatesOnDisk(state, new NgssmAgGridAction(NgssmAgGridActionType.saveColumnStatesOnDisk, gridId));

  it('should save column, group, and filter states to localStorage', () => {
    const columnStates: ColumnState[] = [{ colId: 'name', width: 180, hide: true }];
    const columnGroupStates: ColumnGroupState[] = [{ groupId: 'details', open: false }];
    const filterModel: FilterModel = { name: { filterType: 'text', type: 'contains', filter: 'Ada' } };
    const gridState: GridState = {
      origin: ChangeOrigin.agGrid,
      columnStates,
      columnGroupStates,
      filterModel
    };

    save(createState(gridState));

    expect(localStorage.getItem(getColumnStatesLocalStorageKey(gridId))).toBe(JSON.stringify(columnStates));
    expect(localStorage.getItem(getcolumnGroupStatesLocalStorageKey(gridId))).toBe(JSON.stringify(columnGroupStates));
    expect(localStorage.getItem(getFilterModelLocalStorageKey(gridId))).toBe(JSON.stringify(filterModel));
  });

  it('should save column and group states without saving a null filter model', () => {
    const columnStates: ColumnState[] = [{ colId: 'name', width: 180 }];
    const columnGroupStates: ColumnGroupState[] = [{ groupId: 'details', open: true }];
    const gridState: GridState = {
      origin: ChangeOrigin.agGrid,
      columnStates,
      columnGroupStates,
      filterModel: null
    };

    save(createState(gridState));

    expect(localStorage.getItem(getColumnStatesLocalStorageKey(gridId))).toBe(JSON.stringify(columnStates));
    expect(localStorage.getItem(getcolumnGroupStatesLocalStorageKey(gridId))).toBe(JSON.stringify(columnGroupStates));
    expect(localStorage.getItem(getFilterModelLocalStorageKey(gridId))).toBeNull();
  });

  it('should not write to localStorage when the grid has no saved state', () => {
    save(createState());

    expect(localStorage.length).toBe(0);
  });
});
