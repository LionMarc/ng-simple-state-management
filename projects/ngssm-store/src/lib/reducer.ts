import { EnvironmentProviders, InjectionToken, Type, makeEnvironmentProviders } from '@angular/core';

import { Action } from './action';
import { State } from './state';

export interface Reducer {
  processedActions: string[];
  updateState(state: State, action: Action): State;
}

export const NGSSM_REDUCER = new InjectionToken<Reducer>('NGSSM_REDUCER');

export const provideReducer = (reducer: Type<unknown>): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: NGSSM_REDUCER, useClass: reducer, multi: true }]);
};

export const provideReducers = (...reducers: Type<unknown>[]): EnvironmentProviders => {
  return makeEnvironmentProviders(reducers.map((reducer) => ({ provide: NGSSM_REDUCER, useClass: reducer, multi: true })));
};
