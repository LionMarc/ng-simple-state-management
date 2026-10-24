import { State } from 'ngssm-store';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, NgssmAgGridStateSpecification, SelectedRows } from './state';
import { NgssmSetSelectedRowsAction, setSelectedRows } from './set-selected-rows';

describe('NgssmSetSelectedRowsAction', () => {
  it('should create an action with the set selected rows type and supplied values', () => {
    const ids = ['row-1', 'row-2'];

    const action = new NgssmSetSelectedRowsAction('testing-grid', ChangeOrigin.agGrid, ids);

    expect(action.type).toBe(NgssmAgGridActionType.setSelectedRows);
    expect(action.gridId).toBe('testing-grid');
    expect(action.origin).toBe(ChangeOrigin.agGrid);
    expect(action.ids).toBe(ids);
  });
});

describe('setSelectedRows', () => {
  const gridId = 'testing-grid';

  it('should set selected rows for the grid', () => {
    const state: State = {
      [NgssmAgGridStateSpecification.featureStateKey]: NgssmAgGridStateSpecification.initialState
    };
    const ids = ['row-1', 'row-2'];
    const action = new NgssmSetSelectedRowsAction(gridId, ChangeOrigin.agGrid, ids);

    const result = setSelectedRows(state, action);

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {},
      selectedRows: {
        [gridId]: {
          origin: ChangeOrigin.agGrid,
          ids
        }
      }
    });

    expect(state[NgssmAgGridStateSpecification.featureStateKey]).toEqual(NgssmAgGridStateSpecification.initialState);
  });

  it('should replace only the targeted grid selection and preserve other state', () => {
    const otherSelection: SelectedRows = { origin: ChangeOrigin.other, ids: ['row-3'] };
    const existingSelection: SelectedRows = { origin: ChangeOrigin.other, ids: ['old-row'] };
    const state: State = {
      unrelated: { preserved: true },
      [NgssmAgGridStateSpecification.featureStateKey]: {
        gridStates: {},
        selectedRows: {
          [gridId]: existingSelection,
          otherGrid: otherSelection
        }
      }
    };
    const ids = ['row-1'];
    const action = new NgssmSetSelectedRowsAction(gridId, ChangeOrigin.agGrid, ids);

    const result = setSelectedRows(state, action);

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {},
      selectedRows: {
        [gridId]: { origin: ChangeOrigin.agGrid, ids },
        otherGrid: otherSelection
      }
    });
    expect(result['unrelated']).toEqual({ preserved: true });
  });

  it('should allow clearing the selected rows for a grid', () => {
    const state: State = {
      [NgssmAgGridStateSpecification.featureStateKey]: {
        ...NgssmAgGridStateSpecification.initialState,
        selectedRows: {
          [gridId]: { origin: ChangeOrigin.agGrid, ids: ['row-1'] }
        }
      }
    };
    const action = new NgssmSetSelectedRowsAction(gridId, ChangeOrigin.other, []);

    const result = setSelectedRows(state, action);

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {},
      selectedRows: {
        [gridId]: { origin: ChangeOrigin.other, ids: [] }
      }
    });
  });
});
