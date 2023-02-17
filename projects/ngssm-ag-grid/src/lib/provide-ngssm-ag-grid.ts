import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { localStorageEffectProvider } from './effects/local-storage.effect';
import { gridStatesReducerProvider } from './reducers/grid-states.reducer';
import { selectedRowsReducerProvider } from './reducers/selected-rows.reducer';

export const provideNgssmAgGrid = (): EnvironmentProviders => {
  return makeEnvironmentProviders([gridStatesReducerProvider, selectedRowsReducerProvider, localStorageEffectProvider]);
};
