import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmCachingActionType, SetCachedItemAction, UnsetCachedItemAction } from '../actions';
import { selectNgssmCachedItem, updateNgssmCachingState } from '../state';

@Injectable()
export class CachedItemReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmCachingActionType.setCachedItem, NgssmCachingActionType.unsetCachedItem];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmCachingActionType.setCachedItem: {
        const setCachedItemAction = action as SetCachedItemAction;

        return updateNgssmCachingState(state, {
          caches: {
            [setCachedItemAction.cachedItemKey]: {
              $set: {
                status: setCachedItemAction.status,
                error: setCachedItemAction.error,
                item: setCachedItemAction.cachedItem
              }
            }
          }
        });
      }

      case NgssmCachingActionType.unsetCachedItem: {
        const unsetCachedItemAction = action as UnsetCachedItemAction;
        if (selectNgssmCachedItem(state, unsetCachedItemAction.cachedItemKey) === undefined) {
          return state;
        }

        return updateNgssmCachingState(state, {
          caches: { $unset: [unsetCachedItemAction.cachedItemKey] }
        });
      }
    }

    return state;
  }
}
