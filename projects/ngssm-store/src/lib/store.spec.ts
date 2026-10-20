import { effect, inject, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import update from 'immutability-helper';

import { State } from './state';
import { NGSSM_STATE_INITIALIZER, StateInitializer } from './state-initializer';
import { Store } from './store';
import { NGSSM_REDUCER, provideReducerFunc, Reducer } from './reducer';
import { Effect, NGSSM_EFFECT } from './effect';
import { Action } from './action';

describe('Store', () => {
  const REDUCER_FUNC_VALUE = new InjectionToken<string>('REDUCER_FUNC_VALUE');
  let store: Store;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should store the dispatched action in the queue before processing it in the next iteration', () => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(Store);

    store.dispatchAction({ type: 'testing' });
    expect(store['actionQueue'].length).toEqual(1);
    vi.runAllTimers();
    expect(store['actionQueue'].length).toEqual(0);
  });

  it('should call all the state initializers when the object is generated', () => {
    const first: StateInitializer = {
      initializeState: (state: State) =>
        update(state, {
          first: {
            $set: {
              message: 'initialized'
            }
          }
        })
    };
    const second: StateInitializer = {
      initializeState: (state: State) =>
        update(state, {
          second: {
            $set: {
              message: 'initialized'
            }
          }
        })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: NGSSM_STATE_INITIALIZER, useValue: first, multi: true },
        { provide: NGSSM_STATE_INITIALIZER, useValue: second, multi: true }
      ]
    });
    store = TestBed.inject(Store);

    expect(store.state()).toEqual({
      first: {
        message: 'initialized'
      },
      second: {
        message: 'initialized'
      }
    });
  });

  it('should call the reducers associated to the dispatched action only', () => {
    const first: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State) => update(state, { first: { $set: { message: 'called' } } })
    };
    const second: Reducer = {
      processedActions: ['deleteTodo'],
      updateState: (state: State) => update(state, { second: { $set: { message: 'called' } } })
    };
    const third: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State) => update(state, { third: { $set: { message: 'called' } } })
    };

    vi.spyOn(first, 'updateState');
    vi.spyOn(second, 'updateState');
    vi.spyOn(third, 'updateState');

    TestBed.configureTestingModule({
      providers: [
        { provide: NGSSM_REDUCER, useValue: first, multi: true },
        { provide: NGSSM_REDUCER, useValue: second, multi: true },
        { provide: NGSSM_REDUCER, useValue: third, multi: true }
      ]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    vi.runAllTimers();

    expect(first.updateState).toHaveBeenCalled();
    expect(second.updateState).not.toHaveBeenCalled();
    expect(third.updateState).toHaveBeenCalled();

    expect(store.state()).toEqual({
      first: { message: 'called' },
      third: { message: 'called' }
    });
  });

  it('should apply reducer functions registered for the dispatched action types', () => {
    const reducerFunc = vi.fn((state: State) => update(state, { fromReducerFunc: { $set: true } }));

    TestBed.configureTestingModule({
      providers: [provideReducerFunc(['createTodo', 'updateTodo'], reducerFunc)]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    store.dispatchActionType('updateTodo');
    vi.runAllTimers();

    expect(reducerFunc).toHaveBeenCalledTimes(2);
    expect(store.state()).toEqual({ fromReducerFunc: true });
  });

  it('should apply reducer functions after matching class reducers', () => {
    const reducer: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State) => update(state, { value: { $set: 1 } })
    };
    const reducerFunc = (state: State) => update(state, { value: { $set: 2 } });

    TestBed.configureTestingModule({
      providers: [{ provide: NGSSM_REDUCER, useValue: reducer, multi: true }, provideReducerFunc(['createTodo'], reducerFunc)]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    vi.runAllTimers();

    expect(store.state()).toEqual({ value: 2 });
  });

  it('should execute reducer functions in an injection context', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: REDUCER_FUNC_VALUE, useValue: 'injected' },
        provideReducerFunc(['createTodo'], (state) => update(state, { injectedValue: { $set: inject(REDUCER_FUNC_VALUE) } }))
      ]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    vi.runAllTimers();

    expect(store.state()).toEqual({ injectedValue: 'injected' });
  });

  it('should notify the processed action', async () => {
    const first: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State) => update(state, { first: { $set: { message: 'called' } } })
    };

    vi.spyOn(first, 'updateState');

    TestBed.configureTestingModule({
      providers: [{ provide: NGSSM_REDUCER, useValue: first, multi: true }]
    });
    store = TestBed.inject(Store);

    let lastAction: Action | undefined = undefined;
    let stateAfterAction: State | undefined = undefined;
    TestBed.runInInjectionContext(() => {
      effect(() => {
        lastAction = store.processedAction();
        stateAfterAction = store.state();
      });
    });

    store.dispatchActionType('createTodo');
    await vi.runAllTimersAsync();

    expect(first.updateState).toHaveBeenCalled();

    expect(lastAction as unknown).toEqual({ type: 'createTodo' });
    expect(stateAfterAction as unknown).toEqual({
      first: { message: 'called' }
    });
  });

  it('should call the effects associated to the dispatched action only', () => {
    const first: Effect = {
      processedActions: ['createTodo'],
      processAction: () => {
        console.log('createTodo');
      }
    };
    const second: Effect = {
      processedActions: ['deleteTodo'],
      processAction: () => {
        console.log('deleteTodo');
      }
    };
    const third: Effect = {
      processedActions: ['createTodo'],
      processAction: () => {
        console.log('createTodo');
      }
    };

    vi.spyOn(first, 'processAction');
    vi.spyOn(second, 'processAction');
    vi.spyOn(third, 'processAction');

    TestBed.configureTestingModule({
      providers: [
        { provide: NGSSM_EFFECT, useValue: first, multi: true },
        { provide: NGSSM_EFFECT, useValue: second, multi: true },
        { provide: NGSSM_EFFECT, useValue: third, multi: true }
      ]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    vi.runAllTimers();

    expect(first.processAction).toHaveBeenCalled();
    expect(second.processAction).not.toHaveBeenCalled();
    expect(third.processAction).toHaveBeenCalled();
  });
});
