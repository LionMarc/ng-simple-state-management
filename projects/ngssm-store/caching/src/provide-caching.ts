import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideReducers } from 'ngssm-store';
import { CachedItemReducer } from './reducers';

export const provideCaching = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(CachedItemReducer)]);
};
