/* eslint-disable @typescript-eslint/no-explicit-any */
import { effect } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import update from 'immutability-helper';

import { State } from './state';
import { NGSSM_STATE_INITIALIZER, StateInitializer } from './state-initializer';
import { Store } from './store';
import { NGSSM_REDUCER, Reducer } from './reducer';
import { Effect, NGSSM_EFFECT } from './effect';
import { Action } from './action';

describe('Store', () => {
  let store: Store;

  it('should store the dispatched action in the queue before processing it in the next iteration', fakeAsync(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(Store);

    store.dispatchAction({ type: 'testing' });
    expect((store as any).actionQueue.length).toEqual(1);
    tick();
    expect((store as any).actionQueue.length).toEqual(0);
  }));

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

  it('should call the reducers associated to the dispatched action only', fakeAsync(() => {
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

    spyOn(first, 'updateState').and.callThrough();
    spyOn(second, 'updateState').and.callThrough();
    spyOn(third, 'updateState').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        { provide: NGSSM_REDUCER, useValue: first, multi: true },
        { provide: NGSSM_REDUCER, useValue: second, multi: true },
        { provide: NGSSM_REDUCER, useValue: third, multi: true }
      ]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    tick();

    expect(first.updateState).toHaveBeenCalled();
    expect(second.updateState).not.toHaveBeenCalled();
    expect(third.updateState).toHaveBeenCalled();

    expect(store.state()).toEqual({
      first: { message: 'called' },
      third: { message: 'called' }
    });
  }));

  it('should notify the processed action', fakeAsync(() => {
    const first: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State) => update(state, { first: { $set: { message: 'called' } } })
    };

    spyOn(first, 'updateState').and.callThrough();

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
    tick();

    expect(first.updateState).toHaveBeenCalled();

    expect(lastAction as unknown).toEqual({ type: 'createTodo' });
    expect(stateAfterAction as unknown).toEqual({
      first: { message: 'called' }
    });
  }));

  it('should call the effects associated to the dispatched action only', fakeAsync(() => {
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

    spyOn(first, 'processAction').and.callThrough();
    spyOn(second, 'processAction').and.callThrough();
    spyOn(third, 'processAction').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        { provide: NGSSM_EFFECT, useValue: first, multi: true },
        { provide: NGSSM_EFFECT, useValue: second, multi: true },
        { provide: NGSSM_EFFECT, useValue: third, multi: true }
      ]
    });
    store = TestBed.inject(Store);

    store.dispatchActionType('createTodo');
    tick();

    expect(first.processAction).toHaveBeenCalled();
    expect(second.processAction).not.toHaveBeenCalled();
    expect(third.processAction).toHaveBeenCalled();
  }));
});
