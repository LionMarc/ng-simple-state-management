import { State } from 'ngssm-store';

import { CachedItemReducer } from './cached-item.reducer';
import { NgssmCachingActionType, SetCachedItemAction, UnsetCachedItemAction } from '../actions';
import { NgssmCachingStateSpecification, selectNgssmCachedItem, selectNgssmCachingState, updateNgssmCachingState } from '../state';
import { CachedItemStatus } from '../model';

describe('CachedItemReducer', () => {
  let reducer: CachedItemReducer;
  let state: State;

  beforeEach(() => {
    reducer = new CachedItemReducer();
    state = {
      [NgssmCachingStateSpecification.featureStateKey]: NgssmCachingStateSpecification.initialState
    };
  });

  [NgssmCachingActionType.setCachedItem, NgssmCachingActionType.unsetCachedItem].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmCachingActionType.setCachedItem}'`, () => {
    it(`should add key if key does not exist`, () => {
      const action = new SetCachedItemAction('testing', { status: CachedItemStatus.set, item: 'stringContent' });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmCachedItem(updatedState, 'testing')).toEqual({
        status: CachedItemStatus.set,
        item: 'stringContent'
      });
    });

    describe(`when key exists`, () => {
      beforeEach(() => {
        state = updateNgssmCachingState(state, {
          caches: {
            ['testing']: {
              $set: {
                status: CachedItemStatus.loading,
                item: 'waiting' as never
              }
            }
          }
        });
      });

      it(`should update the status if only the status is specified`, () => {
        const action = new SetCachedItemAction('testing', { status: CachedItemStatus.set });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmCachedItem(updatedState, 'testing')).toEqual({
          status: CachedItemStatus.set,
          item: 'waiting'
        });
      });

      it(`should update the item if only the item is specified`, () => {
        const action = new SetCachedItemAction('testing', { item: 'nothing for now' });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmCachedItem(updatedState, 'testing')).toEqual({
          status: CachedItemStatus.loading,
          item: 'nothing for now'
        });
      });

      it(`should update the error if only the error is specified`, () => {
        const action = new SetCachedItemAction('testing', { error: 'unexpected error' });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmCachedItem(updatedState, 'testing')).toEqual({
          status: CachedItemStatus.loading,
          item: 'waiting',
          error: 'unexpected error'
        });
      });

      it(`should update the cached item`, () => {
        const action = new SetCachedItemAction('testing', { status: CachedItemStatus.error, item: 'done with error' });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmCachedItem(updatedState, 'testing')).toEqual({
          status: CachedItemStatus.error,
          item: 'done with error'
        });
      });
    });
  });

  describe(`when processing action of type '${NgssmCachingActionType.unsetCachedItem}'`, () => {
    const action = new UnsetCachedItemAction('testing');

    it(`should do nothing when key does not exist`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(updatedState).toBe(state);
    });

    it(`should remove key when key exists`, () => {
      state = updateNgssmCachingState(state, {
        caches: {
          ['first']: {
            $set: {
              status: CachedItemStatus.loading
            }
          },
          ['testing']: {
            $set: {
              status: CachedItemStatus.loading,
              item: 'waiting' as never
            }
          }
        }
      });
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmCachingState(updatedState).caches).toEqual({
        first: {
          status: CachedItemStatus.loading
        }
      });
    });
  });
});
