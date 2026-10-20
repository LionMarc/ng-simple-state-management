import { inject, Service } from '@angular/core';

import { Action } from './action';
import { Logger } from './logging';
import { NGSSM_REDUCER, Reducer } from './reducer';
import { State } from './state';

@Service()
export class ReducerCollection {
  private readonly reducers: Reducer[] = (inject(NGSSM_REDUCER, { optional: true }) as unknown as Reducer[] | null) ?? [];
  private readonly logger = inject(Logger);
  private readonly reducersPerActionType = new Map<string, Reducer[]>();

  constructor() {
    this.logger.information(`[Store] ---> initialization of ${this.reducers.length} reducers...`);
    this.reducers.forEach((reducer) => {
      this.logger.information('[Store] ------> initialization of ', reducer);
      reducer.processedActions.forEach((actionType) => {
        const reducers = this.reducersPerActionType.get(actionType) ?? [];
        if (reducers.length === 0) {
          this.reducersPerActionType.set(actionType, reducers);
        }
        reducers.push(reducer);
      });
    });
  }

  public applyReducers(state: State, action: Action): State {
    const reducers = this.reducersPerActionType.get(action.type) ?? [];
    this.logger.debug(`[Store] ${reducers.length} reducers found to process the action ${action.type}`, reducers);
    return reducers.reduce((currentState, reducer) => reducer.updateState(currentState, action), state);
  }
}
