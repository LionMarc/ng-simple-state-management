import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideReducers } from 'ngssm-store';

import { localStorageEffectProvider } from './effects/local-storage.effect';
import { GridStatesReducer } from './reducers/grid-states.reducer';
import { SelectedRowsReducer } from './reducers/selected-rows.reducer';

export const provideNgssmAgGrid = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(GridStatesReducer, SelectedRowsReducer), localStorageEffectProvider]);
};
