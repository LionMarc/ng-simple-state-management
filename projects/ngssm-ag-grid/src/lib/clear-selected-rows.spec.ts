import { State } from 'ngssm-store';

import { NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { ChangeOrigin, NgssmAgGridStateSpecification, SelectedRows } from './state';
import { NgssmClearSelectedRowsAction, clearSelectedRows } from './clear-selected-rows';

describe('NgssmClearSelectedRowsAction', () => {
  it('should create an action with the clear selected rows type and grid ID', () => {
    const action = new NgssmClearSelectedRowsAction('testing-grid');

    expect(action.type).toBe(NgssmAgGridActionType.clearSelectedRows);
    expect(action.gridId).toBe('testing-grid');
  });
});

describe('clearSelectedRows', () => {
  const gridId = 'testing-grid';

  it('should clear the targeted grid selection and preserve other grid selections', () => {
    const otherSelection: SelectedRows = { origin: ChangeOrigin.agGrid, ids: ['row-2'] };
    const state: State = {
      unrelated: { preserved: true },
      [NgssmAgGridStateSpecification.featureStateKey]: {
        gridStates: {},
        selectedRows: {
          [gridId]: { origin: ChangeOrigin.agGrid, ids: ['row-1'] },
          otherGrid: otherSelection
        }
      }
    };

    const result = clearSelectedRows(state, new NgssmClearSelectedRowsAction(gridId));

    expect(result[NgssmAgGridStateSpecification.featureStateKey]).toEqual({
      gridStates: {},
      selectedRows: {
        [gridId]: { origin: ChangeOrigin.other, ids: [] },
        otherGrid: otherSelection
      }
    });
    expect(result['unrelated']).toEqual({ preserved: true });
  });
});
