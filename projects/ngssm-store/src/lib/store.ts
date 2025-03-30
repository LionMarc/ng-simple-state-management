import { EnvironmentInjector, Inject, Injectable, Optional, Signal, runInInjectionContext, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import update from 'immutability-helper';

import { FeatureStateSpecification } from './feature-state';
import { State } from './state';
import { Action } from './action';
import { NGSSM_REDUCER, Reducer } from './reducer';
import { Effect, NGSSM_EFFECT } from './effect';
import { NGSSM_STATE_INITIALIZER, StateInitializer } from './state-initializer';
import { Logger } from './logging';
import { ActionDispatcher } from './action-dispatcher';

const featureStateSpecifications: FeatureStateSpecification[] = [];
export const NgSsmFeatureState = (specification: FeatureStateSpecification) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target: object) => {
    featureStateSpecifications.push(specification);
  };
};

/**
 * The `Store` class is a centralized state management system for Angular applications.
 * It manages the application state, processes actions using reducers, and handles side effects using effects.
 * The class integrates both RxJS (`BehaviorSubject`) and Angular signals for reactive state management.
 *
 * ### Features:
 * - Centralized state management with support for reducers and effects.
 * - Reactive state updates using both RxJS and Angular signals.
 * - Modular initialization of feature states, reducers, and effects.
 * - Sequential action processing with an action queue.
 * - Logging for debugging and monitoring state changes and action processing.
 *
 * ### Usage:
 * - Dispatch actions using `dispatchAction` or `dispatchActionType`.
 * - Subscribe to state updates using `state$` (RxJS) or `state` (Angular signal).
 */
@Injectable({
  providedIn: 'root'
})
export class Store implements ActionDispatcher {
  // The current state of the application, managed as a BehaviorSubject for RxJS compatibility.
  private readonly _state$ = new BehaviorSubject<State>({});

  // A queue to ensure actions are processed sequentially.
  private readonly actionQueue: Action[] = [];

  // Maps action types to their corresponding reducers.
  private readonly reducersPerActionType = new Map<string, Reducer[]>();

  // Maps action types to their corresponding effects.
  private readonly effectsPerActionType = new Map<string, Effect[]>();

  // The current state of the application, managed as an Angular signal for signal-based reactivity.
  private readonly _stateSignal = signal<State>({});

  // The most recently action processed by reducers, managed as an Angular signal.
  private readonly _processedAction = signal<Action>({ type: '' });

  /**
   * Initializes the `Store` with reducers, effects, and state initializers.
   * Also sets up the initial state and registers reducers and effects.
   *
   * @param logger - Logger service for debugging and monitoring.
   * @param reducers - Array of reducers to process state updates.
   * @param effects - Array of effects to handle side effects.
   * @param initializers - Array of state initializers to set up the initial state.
   * @param injector - Angular's `EnvironmentInjector` for running effects in the correct context.
   */
  constructor(
    private logger: Logger,
    @Inject(NGSSM_REDUCER) @Optional() reducers: Reducer[],
    @Inject(NGSSM_EFFECT) @Optional() effects: Effect[],
    @Inject(NGSSM_STATE_INITIALIZER) @Optional() initializers: StateInitializer[],
    private injector: EnvironmentInjector
  ) {
    // Synchronize the RxJS state with the Angular signal state.
    this._state$.subscribe((value) => this._stateSignal.set(value));

    this.logger.information('[Store] ---> state initialization...');
    let state = this._state$.getValue();

    // Initialize feature states.
    state = featureStateSpecifications.reduce((p, c) => update(p, { [c.featureStateKey]: { $set: c.initialState } }), state);

    // Apply state initializers.
    (initializers ?? []).forEach((initializer) => {
      this.logger.information('[Store] ------> calling initializer', initializer);
      state = initializer.initializeState(state);
    });

    // Update the state with the initialized values.
    this._state$.next(state);

    // Register reducers and effects.
    this.logger.information(`[Store] ---> initialization of ${(reducers ?? []).length} reducers...`);
    this.initializeProcessors(reducers, this.reducersPerActionType, (r) => r.processedActions);
    this.logger.information(`[Store] ---> initialization of ${(effects ?? []).length} effects...`);
    this.initializeProcessors(effects, this.effectsPerActionType, (e) => e.processedActions);
  }

  /**
   * Returns the current state as an RxJS observable.
   * Useful for subscribing to state changes in a reactive manner.
   */
  public get state$(): Observable<State> {
    return this._state$.asObservable();
  }

  /**
   * Returns the most recently action processed by reducers as an Angular signal.
   * Useful for accessing the last processed action in a reactive manner.
   * This signal is updated before processing the effects.
   */
  public get processedAction(): Signal<Action> {
    return this._processedAction.asReadonly();
  }

  /**
   * Returns the current state as an Angular signal.
   * Useful for signal-based reactivity in Angular components.
   */
  public get state(): Signal<State> {
    return this._stateSignal.asReadonly();
  }

  /**
   * Dispatches an action to the store.
   * The action is added to the action queue and processed sequentially.
   *
   * @param action - The action to dispatch.
   */
  public dispatchAction(action: Action): void {
    this.actionQueue.push(action);
    this.logger.debug(`Action of type '${action.type}' added to the queue => ${this.actionQueue.length} pending actions`, action);
    Promise.resolve().then(() => this.processNextAction());
  }

  /**
   * Dispatches an action by its type.
   * This is a shorthand for dispatching actions without additional payload.
   *
   * @param type - The type of the action to dispatch.
   */
  public dispatchActionType(type: string): void {
    this.dispatchAction({ type });
  }

  /**
   * Processes the next action in the action queue.
   * Applies reducers to update the state and executes effects for side effects.
   */
  private processNextAction(): void {
    const nextAction = this.actionQueue.shift();
    if (!nextAction) {
      this.logger.debug('[processNextAction] No action to process');
      return;
    }

    this.logger.information(`[processNextAction] Start processing action '${nextAction.type}...`, nextAction);

    try {
      // Apply reducers to update the state.
      const updatedState = this.applyReducers(nextAction);

      // Execute effects for the action.
      const effects = this.effectsPerActionType.get(nextAction.type) ?? [];
      this.logger.debug(`[Store] ${effects.length} effects found to process the action ${nextAction.type}`, effects);
      effects.forEach((effect) => {
        if (effect.isFunc === true) {
          runInInjectionContext(this.injector, () => this.runEffect(effect, updatedState, nextAction));
        } else {
          this.runEffect(effect, updatedState, nextAction);
        }
      });
    } catch (error) {
      this.logger.error(`Error when processing action ${nextAction.type}`, {
        error,
        action: nextAction
      });
    } finally {
      this.logger.information(`[processNextAction] action '${nextAction.type} processed.`, nextAction);

      // Process the next action asynchronously.
      Promise.resolve().then(() => this.processNextAction());
    }
  }

  /**
   * Applies reducers to the current state based on the dispatched action.
   * Updates the state if there are changes and sets the processed action signal.
   *
   * @param nextAction - The action being processed.
   * @returns The updated state after applying reducers.
   */
  private applyReducers(nextAction: Action): State {
    try {
      const reducers = this.reducersPerActionType.get(nextAction.type) ?? [];
      this.logger.debug(`[Store] ${reducers.length} reducers found to process the action ${nextAction.type}`, reducers);
      const currentState = this._state$.getValue();
      const updatedState = reducers.reduce((p, c) => c.updateState(p, nextAction), currentState);

      if (updatedState !== currentState) {
        this._state$.next(updatedState);
      }

      return updatedState;
    } finally {
      this._processedAction.set(nextAction); // Update the processed action signal.
    }
  }

  /**
   * Executes an effect for a given action.
   * Handles any errors that occur during effect execution.
   *
   * @param effect - The effect to execute.
   * @param updatedState - The updated state after reducers have been applied.
   * @param nextAction - The action being processed.
   */
  private runEffect(effect: Effect, updatedState: State, nextAction: Action): void {
    try {
      effect.processAction(this, updatedState, nextAction);
    } catch (error) {
      this.logger.error(`Unable to process action ${nextAction.type} by effect ${effect}`, {
        error,
        action: nextAction,
        processor: effect
      });
    }
  }

  /**
   * Initializes reducers or effects and maps them to their corresponding action types.
   *
   * @param processors - The array of reducers or effects to initialize.
   * @param processorMap - The map to store processors by action type.
   * @param getProcessedActions - A function to retrieve the action types processed by a processor.
   */
  private initializeProcessors<T>(
    processors: T[] | undefined,
    processorMap: Map<string, T[]>,
    getProcessedActions: (processor: T) => string[]
  ): void {
    (processors ?? []).forEach((processor) => {
      this.logger.information('[Store] ------> initialization of ', processor);
      getProcessedActions(processor).forEach((actionType) => {
        const storedProcessors = processorMap.get(actionType) ?? [];
        if (storedProcessors.length === 0) {
          processorMap.set(actionType, storedProcessors);
        }
        storedProcessors.push(processor);
      });
    });
  }
}
