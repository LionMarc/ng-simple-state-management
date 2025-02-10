import { EnvironmentProviders, InjectionToken, Type, makeEnvironmentProviders } from '@angular/core';

import { Action } from './action';
import { State } from './state';
import { ActionDispatcher } from './action-dispatcher';

export interface Effect {
  processedActions: string[];
  processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void;
  isFunc?: boolean;
}

export const NGSSM_EFFECT = new InjectionToken<Effect>('NGSSM_EFFECT');

export const provideEffect = (effect: Type<unknown>): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: NGSSM_EFFECT, useClass: effect, multi: true }]);
};

export const provideEffects = (...effects: Type<unknown>[]): EnvironmentProviders => {
  return makeEnvironmentProviders(effects.map((effect) => ({ provide: NGSSM_EFFECT, useClass: effect, multi: true })));
};

export type EffectFunc = (state: State, action: Action) => void;

export const provideEffectFunc = (actionType: string, effectFunc: EffectFunc): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_EFFECT,
      useFactory: () => {
        const effect: Effect = {
          processedActions: [actionType],
          processAction: (_, state, action) => effectFunc(state, action),
          isFunc: true
        };
        return effect;
      },
      multi: true
    }
  ]);
};
