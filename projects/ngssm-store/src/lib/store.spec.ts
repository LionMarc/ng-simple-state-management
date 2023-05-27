import { fakeAsync, tick } from '@angular/core/testing';

import update from 'immutability-helper';

import { State } from './state';
import { StateInitializer } from './state-initializer';
import { Store } from './store';
import { Reducer } from './reducer';
import { Action } from './action';
import { Effect } from './effect';
import { Logger } from './logging';

describe('Store', () => {
  let logger: Logger;
  let store: Store;

  beforeEach(() => {
    logger = new Logger();
  });

  it('should store the dispatched action in the queue before processing it in the next iteration', fakeAsync(() => {
    store = new Store(logger, [], [], []);

    store.dispatchAction({ type: 'testing' });
    expect((store as any).actionQueue.length).toEqual(1);
    tick();
    expect((store as any).actionQueue.length).toEqual(0);
  }));

  it('should call all the state initializers when the object is generated', () => {
    const first: StateInitializer = {
      initializeState: (state: State) => update(state, { first: { $set: 'initialized' } })
    };
    const second: StateInitializer = {
      initializeState: (state: State) => update(state, { second: { $set: 'initialized' } })
    };

    store = new Store(logger, [], [], [first, second]);

    expect(store.state()).toEqual({
      first: 'initialized',
      second: 'initialized'
    });
  });

  it('should call the reducers associated to the dispatched action only', fakeAsync(() => {
    const first: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State, action: Action) => update(state, { first: { $set: 'called' } })
    };
    const second: Reducer = {
      processedActions: ['deleteTodo'],
      updateState: (state: State, action: Action) => update(state, { second: { $set: 'called' } })
    };
    const third: Reducer = {
      processedActions: ['createTodo'],
      updateState: (state: State, action: Action) => update(state, { third: { $set: 'called' } })
    };

    spyOn(first, 'updateState').and.callThrough();
    spyOn(second, 'updateState').and.callThrough();
    spyOn(third, 'updateState').and.callThrough();

    store = new Store(logger, [first, second, third], [], []);

    store.dispatchActionType('createTodo');
    tick();

    expect(first.updateState).toHaveBeenCalled();
    expect(second.updateState).not.toHaveBeenCalled();
    expect(third.updateState).toHaveBeenCalled();

    expect(store.state()).toEqual({
      first: 'called',
      third: 'called'
    });
  }));

  it('should call the effects associated to the dispatched action only', fakeAsync(() => {
    const first: Effect = {
      processedActions: ['createTodo'],
      processAction: (store: Store, state: State, action: Action) => {}
    };
    const second: Effect = {
      processedActions: ['deleteTodo'],
      processAction: (store: Store, state: State, action: Action) => {}
    };
    const third: Effect = {
      processedActions: ['createTodo'],
      processAction: (store: Store, state: State, action: Action) => {}
    };

    spyOn(first, 'processAction').and.callThrough();
    spyOn(second, 'processAction').and.callThrough();
    spyOn(third, 'processAction').and.callThrough();

    store = new Store(logger, [], [first, second, third], []);

    store.dispatchActionType('createTodo');
    tick();

    expect(first.processAction).toHaveBeenCalled();
    expect(second.processAction).not.toHaveBeenCalled();
    expect(third.processAction).toHaveBeenCalled();
  }));
});
