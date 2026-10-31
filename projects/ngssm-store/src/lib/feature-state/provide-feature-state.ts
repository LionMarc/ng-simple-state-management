import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import update from 'immutability-helper';

import { NGSSM_STATE_INITIALIZER, StateInitializer } from '../state-initializer';
import { State } from '../state';

export const provideNgssmFeatureState = (featureStateKey: string, initialValue: object): EnvironmentProviders => {
  const initializer: StateInitializer = {
    initializeState: (state: State) => update(state, { [featureStateKey]: { $set: initialValue } })
  };

  return makeEnvironmentProviders([{ provide: NGSSM_STATE_INITIALIZER, useValue: initializer, multi: true }]);
};
