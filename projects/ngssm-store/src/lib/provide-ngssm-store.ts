import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideReducers } from './reducer';
import { FeatureStateReducer } from './feature-state';

export const provideNgssmStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(FeatureStateReducer)]);
};
