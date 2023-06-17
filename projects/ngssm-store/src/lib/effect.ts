import { EnvironmentProviders, InjectionToken, Type, makeEnvironmentProviders } from '@angular/core';

import { Action } from './action';
import { State } from './state';
import { Store } from './store';

export interface Effect {
  processedActions: string[];
  processAction(store: Store, state: State, action: Action): void;
}

export const NGSSM_EFFECT = new InjectionToken<Effect>('NGSSM_EFFECT');

export const provideEffect = (effect: Type<any>): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: NGSSM_EFFECT, useClass: effect, multi: true }]);
};

export const provideEffects = (...effects: Type<any>[]): EnvironmentProviders => {
  return makeEnvironmentProviders(effects.map((effect) => ({ provide: NGSSM_EFFECT, useClass: effect, multi: true })));
};
