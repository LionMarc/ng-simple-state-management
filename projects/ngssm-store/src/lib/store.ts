import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import update from 'immutability-helper';

import { Logger } from 'ngssm-toolkit';

import { FeatureStateSpecification } from './feature-state-specification';
import { State } from './state';
import { Action } from './action';
import { NGSSM_REDUCER, Reducer } from './reducer';
import { Effect, NGSSM_EFFECT } from './effect';
import { NGSSM_STATE_INITIALIZER, StateInitializer } from './state-initializer';

const featureStateSpecifications: FeatureStateSpecification[] = [];
export const NgSsmFeatureState = (specification: FeatureStateSpecification) => {
  return (target: object) => {
    featureStateSpecifications.push(specification);
  };
};

@Injectable({
  providedIn: 'root'
})
export class Store {
  private readonly _state$ = new BehaviorSubject<State>({});
  private readonly actionQueue: Action[] = [];
  private readonly reducersPerActionType = new Map<string, Reducer[]>();
  private readonly effectsPerActionType = new Map<string, Effect[]>();

  constructor(
    private logger: Logger,
    @Inject(NGSSM_REDUCER) @Optional() reducers: Reducer[],
    @Inject(NGSSM_EFFECT) @Optional() effects: Effect[],
    @Inject(NGSSM_STATE_INITIALIZER) @Optional() initializers: StateInitializer[]
  ) {
    this.logger.information('[Store] ---> state initialization...');
    let state = this._state$.getValue();
    state = featureStateSpecifications.reduce((p, c) => update(p, { [c.featureStateKey]: { $set: c.initialState } }), state);

    (initializers ?? []).forEach((initializer) => {
      this.logger.information('[Store] ------> calling initializer', initializer);
      state = initializer.initializeState(state);
    });

    this._state$.next(state);

    this.logger.information(`[Store] ---> initialization of ${(reducers ?? []).length} reducers...`);
    (reducers ?? []).forEach((reducer) => {
      this.logger.information('[Store] ------> initialization of ', reducer);
      reducer.processedActions.forEach((processedAction) => {
        const storeReducers: Reducer[] = this.reducersPerActionType.get(processedAction) ?? [];
        if (storeReducers.length === 0) {
          this.reducersPerActionType.set(processedAction, storeReducers);
        }

        storeReducers.push(reducer);
      });
    });

    this.logger.information(`[Store] ---> initialization of ${(effects ?? []).length} effects...`);
    (effects ?? []).forEach((effect) => {
      this.logger.information('[Store] ------> initialization of ', effect);
      effect.processedActions.forEach((processedAction) => {
        const storedEffects: Effect[] = this.effectsPerActionType.get(processedAction) ?? [];
        if (storedEffects.length === 0) {
          this.effectsPerActionType.set(processedAction, storedEffects);
        }

        storedEffects.push(effect);
      });
    });
  }

  public get state$(): Observable<State> {
    return this._state$.asObservable();
  }

  public dispatchAction(action: Action): void {
    this.actionQueue.push(action);
    this.logger.debug(`Action of type '${action.type}' added to the queue => ${this.actionQueue.length} pending actions`, action);
    setTimeout(() => this.processNextAction());
  }

  public dispatchActionType(type: string): void {
    this.dispatchAction({ type });
  }

  private processNextAction(): void {
    const nextAction = this.actionQueue.shift();
    if (!nextAction) {
      this.logger.debug('[processNextAction] No action to process');
      return;
    }

    this.logger.information(`[processNextAction] Start processing action '${nextAction.type}...`, nextAction);

    try {
      const reducers = this.reducersPerActionType.get(nextAction.type) ?? [];
      this.logger.debug(`[Store] ${reducers.length} reducers found to process the action ${nextAction.type}`, reducers);
      const currentState = this._state$.getValue();
      const updatedState = reducers.reduce((p, c) => c.updateState(p, nextAction), currentState);

      if (updatedState !== currentState) {
        this._state$.next(updatedState);
      }

      const effects = this.effectsPerActionType.get(nextAction.type) ?? [];
      this.logger.debug(`[Store] ${effects.length} effects found to process the action ${nextAction.type}`, effects);
      effects.forEach((effect) => {
        try {
          effect.processAction(this, updatedState, nextAction);
        } catch (error) {
          this.logger.error(`Unable to process action ${nextAction.type} by effect ${effect}`, {
            error,
            action: nextAction,
            processor: effect
          });
        }
      });
    } catch (error) {
      this.logger.error(`Error when processing action ${nextAction.type}`, {
        error,
        action: nextAction
      });
    } finally {
      this.logger.information(`[processNextAction] action '${nextAction.type} processed.`, nextAction);

      // Should not be useful.But, just in case.
      setTimeout(() => this.processNextAction());
    }
  }
}
