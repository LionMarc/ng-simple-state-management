import { ColumnState, FilterModel } from 'ag-grid-community';
import { State } from 'ngssm-store';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, ColumnGroupState, GridState, NgssmAgGridStateSpecification } from './state';
import { NgssmSetAgGridStateAction, setAgGridState } from './set-ag-grid-state';

describe('NgssmSetAgGridStateAction', () => {
  it('should create an action with the set grid state type and supplied state', () => {
    const columnStates: ColumnState[] = [{ colId: 'name', width: 180 }];
    const columnGroupStates: ColumnGroupState[] = [{ groupId: 'details', open: true }];
    const filterModel: FilterModel = { name: { filterType: 'text', type: 'contains', filter: 'Ada' } };

    const action = new NgssmSetAgGridStateAction('testing-grid', ChangeOrigin.other, columnStates, columnGroupStates, filterModel);

    expect(action.type).toBe(NgssmAgGridActionType.setAgGridState);
    expect(action.gridId).toBe('testing-grid');
    expect(action.origin).toBe(ChangeOrigin.other);
    expect(action.columnStates).toBe(columnStates);
    expect(action.columnGroupStates).toBe(columnGroupStates);
    expect(action.filterModel).toBe(filterModel);
  });
});

describe('setAgGridState', () => {
  const gridId = 'testing-grid';

  const createAction = (overrides: Partial<GridState> = {}) =>
    new NgssmSetAgGridStateAction(
      gridId,
      overrides.origin ?? ChangeOrigin.other,
      overrides.columnStates ?? [{ colId: 'name', width: 180 }],
      overrides.columnGroupStates ?? [{ groupId: 'details', open: true }],
      overrides.filterModel === undefined ? { name: { filterType: 'text', type: 'contains', filter: 'Ada' } } : overrides.filterModel
    );

  it('should set the grid state from the action', () => {
    const state: State = {
      [NgssmAgGridStateSpecification.featureStateKey]: NgssmAgGridStateSpecification.initialState
    };
    const action = createAction();

    const result = setAgGridState(state, action);

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {
        [gridId]: {
          origin: action.origin,
          columnStates: action.columnStates,
          columnGroupStates: action.columnGroupStates,
          filterModel: action.filterModel
        }
      },
      selectedRows: {}
    });
    expect(state[NgssmAgGridStateSpecification.featureStateKey]).toEqual(NgssmAgGridStateSpecification.initialState);
  });

  it('should replace only the targeted grid state and preserve other state', () => {
    const existingGridState: GridState = {
      origin: ChangeOrigin.agGrid,
      columnStates: [{ colId: 'old-column' }],
      columnGroupStates: [],
      filterModel: null
    };
    const otherGridState: GridState = {
      origin: ChangeOrigin.agGrid,
      columnStates: [{ colId: 'other-column' }],
      columnGroupStates: [{ groupId: 'other-group', open: false }],
      filterModel: null
    };
    const state: State = {
      unrelated: { preserved: true },
      [NgssmAgGridStateSpecification.featureStateKey]: {
        gridStates: {
          [gridId]: existingGridState,
          otherGrid: otherGridState
        },
        selectedRows: { [gridId]: { origin: ChangeOrigin.agGrid, ids: ['row-1'] } }
      }
    };
    const action = createAction({ filterModel: null });

    const result = setAgGridState(state, action);

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {
        [gridId]: {
          origin: action.origin,
          columnStates: action.columnStates,
          columnGroupStates: action.columnGroupStates,
          filterModel: null
        },
        otherGrid: otherGridState
      },
      selectedRows: { [gridId]: { origin: ChangeOrigin.agGrid, ids: ['row-1'] } }
    });
    expect(result['unrelated']).toEqual({ preserved: true });
  });
});
