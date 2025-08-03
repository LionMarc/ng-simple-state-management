import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffect, provideReducers } from 'ngssm-store';

import { LocalStorageEffect } from './effects/local-storage.effect';
import { GridStatesReducer } from './reducers/grid-states.reducer';
import { SelectedRowsReducer } from './reducers/selected-rows.reducer';
import { NGSSM_AG_GRID_OPTIONS, NgssmAgGridOptions } from './ngssm-ag-grid-options';

export const provideNgssmAgGrid = (options?: NgssmAgGridOptions): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_AG_GRID_OPTIONS,
      useValue: options ?? null
    },
    provideReducers(GridStatesReducer, SelectedRowsReducer),
    provideEffect(LocalStorageEffect)
  ]);
};
