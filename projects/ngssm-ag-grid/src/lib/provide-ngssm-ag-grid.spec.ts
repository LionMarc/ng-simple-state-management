import { TestBed } from '@angular/core/testing';
import { ApplicationInitStatus, EnvironmentProviders } from '@angular/core';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { AgGridActionType, AgGridAction } from './actions';
import { provideNgssmAgGrid } from './provide-ngssm-ag-grid';
import { NGSSM_AG_GRID_OPTIONS, NgssmAgGridOptions } from './ngssm-ag-grid-options';

describe('provideNgssmAgGrid', () => {
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({});
    spyOn(store, 'dispatchAction');
    localStorage.clear();
  });

  it('should provide NGSSM_AG_GRID_OPTIONS with given options', () => {
    const options: NgssmAgGridOptions = { theme: 'ag-theme-alpine' } as NgssmAgGridOptions;
    TestBed.configureTestingModule({
      providers: [provideNgssmAgGrid(options) as unknown as EnvironmentProviders]
    });
    const injectedOptions = TestBed.inject(NGSSM_AG_GRID_OPTIONS);
    expect(injectedOptions).toBe(options);
  });

  it('should provide NGSSM_AG_GRID_OPTIONS as null if no options are given', () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmAgGrid()]
    });
    const injectedOptions = TestBed.inject(NGSSM_AG_GRID_OPTIONS, null);
    expect(injectedOptions).toBeNull();
  });

  const setupTest = async (loadAtStartup: boolean) => {
    const keys = ['something', 'ngssm-ag-grid_todo', 'ngssm-ag-grid_sources', 'other'];
    keys.forEach((key) => localStorage.setItem(key, '{}'));

    await TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: store },
        provideNgssmAgGrid({ loadSavedGridStatesAtStartup: loadAtStartup } as unknown as NgssmAgGridOptions)
      ]
    }).compileComponents();

    // Wait for Angular's app initializers to complete
    await TestBed.inject(ApplicationInitStatus).donePromise;
  };

  it('should restore grid states when loadSavedGridStatesAtStartup is true', async () => {
    await setupTest(true);

    expect(store.dispatchAction).toHaveBeenCalledWith(new AgGridAction(AgGridActionType.resetcolumnStatesFromDisk, 'todo'));
    expect(store.dispatchAction).toHaveBeenCalledWith(new AgGridAction(AgGridActionType.resetcolumnStatesFromDisk, 'sources'));
  });

  it('should not restore grid states when loadSavedGridStatesAtStartup is false', async () => {
    await setupTest(false);

    expect(store.dispatchAction).not.toHaveBeenCalled();
  });
});
