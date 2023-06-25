import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideReducers } from 'ngssm-store';
import { VisibilityReducer } from './reducers';

export const provideNgssmVisibility = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(VisibilityReducer)]);
};
