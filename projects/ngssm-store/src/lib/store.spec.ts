/* eslint-disable @typescript-eslint/no-explicit-any */
import { fakeAsync, tick } from '@angular/core/testing';

import update from 'immutability-helper';

import { State } from './state';
import { StateInitializer } from './state-initializer';
import { Store } from './store';
import { Reducer } from './reducer';
import { Effect } from './effect';
import { Logger } from './logging';

describe('Store', () => {
  let logger: Logger;
  let store: Store;

  beforeEach(() => {
    logger = new Logger();
  });

  it('should store the dispatched action in the queue before processing it in the next iteration', fakeAsync(() => {
    store = new Store(logger, [], [], [], {} as any);

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

    store = new Store(logger, [], [], [first, second], {} as any);

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

    store = new Store(logger, [first, second, third], [], [], {} as any);

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

    store = new Store(logger, [], [first, second, third], [], {} as any);

    store.dispatchActionType('createTodo');
    tick();

    expect(first.processAction).toHaveBeenCalled();
    expect(second.processAction).not.toHaveBeenCalled();
    expect(third.processAction).toHaveBeenCalled();
  }));
});
