import { EnvironmentProviders, InjectionToken, Type, makeEnvironmentProviders } from '@angular/core';

import { Action } from './action';
import { State } from './state';

export interface Reducer {
  processedActions: string[];
  updateState(state: State, action: Action): State;
}

export type ReducerFunc<TActionType extends Action = Action> = (state: State, action: TActionType) => State;

export interface ReducerFuncRegistration {
  actionTypes: string[];
  reducerFunc: ReducerFunc;
}

export const NGSSM_REDUCER = new InjectionToken<Reducer>('NGSSM_REDUCER');
export const NGSSM_REDUCER_FUNC = new InjectionToken<ReducerFuncRegistration>('NGSSM_REDUCER_FUNC');

export const provideReducer = (reducer: Type<unknown>): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: NGSSM_REDUCER, useClass: reducer, multi: true }]);
};

export const provideReducers = (...reducers: Type<unknown>[]): EnvironmentProviders => {
  return makeEnvironmentProviders(reducers.map((reducer) => ({ provide: NGSSM_REDUCER, useClass: reducer, multi: true })));
};

export const provideReducerFunc = <TActionType extends Action = Action>(
  actionTypes: string[],
  reducerFunc: ReducerFunc<TActionType>
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_REDUCER_FUNC,
      useValue: { actionTypes, reducerFunc },
      multi: true
    }
  ]);
};
