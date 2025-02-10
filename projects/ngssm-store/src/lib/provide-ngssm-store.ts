import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { provideReducers } from './reducer';
import { ActionDispatcher } from './action-dispatcher';
import { FeatureStateReducer } from './feature-state';
import { Store } from './store';

export const ACTION_DISPATCHER = new InjectionToken<ActionDispatcher>('ACTION_DISPATCHER');

export const provideNgssmStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(FeatureStateReducer), { provide: ACTION_DISPATCHER, useExisting: Store }]);
};
