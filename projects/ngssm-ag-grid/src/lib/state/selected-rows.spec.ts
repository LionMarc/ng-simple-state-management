import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { ChangeOrigin } from './change-origin';
import { NgssmAgGridStateSpecification, updateNgssmAgGridState } from './ngssm-ag-grid.state';
import { selectedRowsIdsSignal } from './selected-rows';

describe('selectedRowsIdsSignal', () => {
  const gridId = 'testing-grid';
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      [NgssmAgGridStateSpecification.featureStateKey]: NgssmAgGridStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }]
    });
  });

  it('should return the selected row IDs for a grid ID', () => {
    store.stateValue = updateNgssmAgGridState(store.stateValue, {
      selectedRows: {
        [gridId]: {
          $set: { origin: ChangeOrigin.agGrid, ids: ['row-1', 'row-2'] }
        }
      }
    });

    const selectedRowIds = TestBed.runInInjectionContext(() => selectedRowsIdsSignal(gridId));

    expect(selectedRowIds()).toEqual(['row-1', 'row-2']);
  });

  it('should return an empty array when a grid has no selected rows', () => {
    const selectedRowIds = TestBed.runInInjectionContext(() => selectedRowsIdsSignal(gridId));

    expect(selectedRowIds()).toEqual([]);
  });

  it('should track selection updates and changes to a signal-based grid ID', () => {
    const gridIdSignal = signal(gridId);
    const selectedRowIds = TestBed.runInInjectionContext(() => selectedRowsIdsSignal(gridIdSignal));

    store.stateValue = updateNgssmAgGridState(store.stateValue, {
      selectedRows: {
        [gridId]: {
          $set: { origin: ChangeOrigin.agGrid, ids: ['row-1'] }
        },
        otherGrid: {
          $set: { origin: ChangeOrigin.other, ids: ['row-2'] }
        }
      }
    });
    expect(selectedRowIds()).toEqual(['row-1']);

    gridIdSignal.set('otherGrid');
    expect(selectedRowIds()).toEqual(['row-2']);
  });
});
