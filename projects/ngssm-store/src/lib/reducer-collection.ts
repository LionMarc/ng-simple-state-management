import { EnvironmentInjector, inject, runInInjectionContext, Service } from '@angular/core';

import { Action } from './action';
import { Logger } from './logging';
import { NGSSM_REDUCER, NGSSM_REDUCER_FUNC, Reducer, ReducerFuncRegistration } from './reducer';
import { State } from './state';

@Service()
export class ReducerCollection {
  private readonly reducers: Reducer[] = (inject(NGSSM_REDUCER, { optional: true }) as unknown as Reducer[] | null) ?? [];
  private readonly reducerFuncs: ReducerFuncRegistration[] =
    (inject(NGSSM_REDUCER_FUNC, { optional: true }) as unknown as ReducerFuncRegistration[] | null) ?? [];
  private readonly logger = inject(Logger);
  private readonly injector = inject(EnvironmentInjector);
  private readonly reducersPerActionType = new Map<string, Reducer[]>();
  private readonly reducerFuncsPerActionType = new Map<string, ReducerFuncRegistration['reducerFunc'][]>();

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

    this.logger.information(`[Store] ---> initialization of ${this.reducerFuncs.length} reducer functions...`);
    this.reducerFuncs.forEach(({ actionTypes, reducerFunc }) => {
      this.logger.information('[Store] ------> initialization of reducer function for ', actionTypes);
      actionTypes.forEach((actionType) => {
        const reducerFuncs = this.reducerFuncsPerActionType.get(actionType) ?? [];
        if (reducerFuncs.length === 0) {
          this.reducerFuncsPerActionType.set(actionType, reducerFuncs);
        }
        reducerFuncs.push(reducerFunc);
      });
    });
  }

  public applyReducers(state: State, action: Action): State {
    const reducers = this.reducersPerActionType.get(action.type) ?? [];
    const reducerFuncs = this.reducerFuncsPerActionType.get(action.type) ?? [];
    this.logger.debug(
      `[Store] ${reducers.length} reducers and ${reducerFuncs.length} reducer functions found to process the action ${action.type}`,
      { reducers, reducerFuncs }
    );

    const stateAfterReducers = reducers.reduce((currentState, reducer) => reducer.updateState(currentState, action), state);
    return reducerFuncs.reduce(
      (currentState, reducerFunc) => runInInjectionContext(this.injector, () => reducerFunc(currentState, action)),
      stateAfterReducers
    );
  }
}
