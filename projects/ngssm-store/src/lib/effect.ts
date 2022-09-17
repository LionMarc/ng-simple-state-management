import { InjectionToken } from '@angular/core';

import { Action } from './action';
import { State } from './state';
import { Store } from './store';

export interface Effect {
  processedActions: string[];
  processAction(store: Store, state: State, action: Action): void;
}

export const NGSSM_EFFECT = new InjectionToken<Effect>('NGSSM_EFFECT');
