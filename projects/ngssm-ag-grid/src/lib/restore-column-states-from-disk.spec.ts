import { TestBed } from '@angular/core/testing';

import { ColumnState, FilterModel } from 'ag-grid-community';
import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmAgGridAction, NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import {
  getcolumnGroupStatesLocalStorageKey,
  getColumnStatesLocalStorageKey,
  getFilterModelLocalStorageKey
} from './save-column-states-on-disk';
import { ChangeOrigin, ColumnGroupState } from './state';
import { NgssmSetAgGridStateAction } from './set-ag-grid-state';
import { restoreColumnStatesFromDisk } from './restore-column-states-from-disk';

describe('restoreColumnStatesFromDisk', () => {
  const gridId = 'testing-grid';
  let store: StoreMock;
  let logger: Logger;

  beforeEach(() => {
    localStorage.clear();
    store = new StoreMock({});
    vi.spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }]
    });
    logger = TestBed.inject(Logger);
    vi.spyOn(logger, 'error');
  });

  const restore = () =>
    TestBed.runInInjectionContext(() =>
      restoreColumnStatesFromDisk({}, new NgssmAgGridAction(NgssmAgGridActionType.restoreColumnStatesFromDisk, gridId))
    );

  it('should restore column, group, and filter states', () => {
    const columnStates: ColumnState[] = [{ colId: 'name', width: 180, hide: true }];
    const columnGroupStates: ColumnGroupState[] = [{ groupId: 'details', open: false }];
    const filterModel: FilterModel = { name: { filterType: 'text', type: 'contains', filter: 'Ada' } };
    localStorage.setItem(getColumnStatesLocalStorageKey(gridId), JSON.stringify(columnStates));
    localStorage.setItem(getcolumnGroupStatesLocalStorageKey(gridId), JSON.stringify(columnGroupStates));
    localStorage.setItem(getFilterModelLocalStorageKey(gridId), JSON.stringify(filterModel));

    restore();

    expect(store.dispatchAction).toHaveBeenCalledWith(
      new NgssmSetAgGridStateAction(gridId, ChangeOrigin.other, columnStates, columnGroupStates, filterModel)
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should use empty group states and a null filter model when those states are not stored', () => {
    const columnStates: ColumnState[] = [{ colId: 'name', width: 180 }];
    localStorage.setItem(getColumnStatesLocalStorageKey(gridId), JSON.stringify(columnStates));

    restore();

    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmSetAgGridStateAction(gridId, ChangeOrigin.other, columnStates, [], null));
  });

  it('should not dispatch when no column states are stored', () => {
    restore();

    expect(store.dispatchAction).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should log an error and not dispatch when the stored column states contain invalid JSON', () => {
    localStorage.setItem(getColumnStatesLocalStorageKey(gridId), '{invalid');

    restore();

    expect(store.dispatchAction).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Unable to load config for grid '${gridId}'`, expect.any(SyntaxError));
  });

  it('should log an error and not dispatch when the stored column states are not an array', () => {
    const stored = JSON.stringify({ colId: 'name' });
    localStorage.setItem(getColumnStatesLocalStorageKey(gridId), stored);

    restore();

    expect(store.dispatchAction).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Wrong columns state config for grid '${gridId}'`, stored);
  });

  it('should log an error and not dispatch when stored optional states contain invalid JSON', () => {
    localStorage.setItem(getColumnStatesLocalStorageKey(gridId), JSON.stringify([{ colId: 'name' }]));
    localStorage.setItem(getcolumnGroupStatesLocalStorageKey(gridId), '{invalid');

    restore();

    expect(store.dispatchAction).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(`Unable to load config for grid '${gridId}'`, expect.any(SyntaxError));
  });
});
