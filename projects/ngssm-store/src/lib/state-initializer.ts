import { InjectionToken } from '@angular/core';
import { State } from './state';

export interface StateInitializer {
  initializeState(state: State): State;
}

export const NGSSM_STATE_INITIALIZER = new InjectionToken<StateInitializer>('NGSSM_STATE_INITIALIZER');
