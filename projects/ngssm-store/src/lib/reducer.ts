import { InjectionToken } from '@angular/core';

import { Action } from './action';
import { State } from './state';

export interface Reducer {
  processedActions: string[];
  updateState(state: State, action: Action): State;
}

export const NGSSM_REDUCER = new InjectionToken<Reducer>('NGSSM_REDUCER');
