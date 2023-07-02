import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { CachingActionType, SetCachedItemAction, UnsetCachedItemAction } from '../actions';
import { selectCachedItem, updateCachingState } from '../state';
import { CachedItem, CachedItemStatus } from '../model';

@Injectable()
export class CachedItemReducer implements Reducer {
  public readonly processedActions: string[] = [CachingActionType.setCachedItem, CachingActionType.unsetCachedItem];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case CachingActionType.setCachedItem: {
        const setCachedItemAction = action as SetCachedItemAction;
        if (selectCachedItem(state, setCachedItemAction.cachedItemKey) === undefined) {
          const cachedItem: CachedItem = {
            status: CachedItemStatus.notSet,
            ...setCachedItemAction.cachedItem
          };
          return updateCachingState(state, {
            caches: {
              [setCachedItemAction.cachedItemKey]: { $set: cachedItem }
            }
          });
        }

        return updateCachingState(state, {
          caches: {
            [setCachedItemAction.cachedItemKey]: { $merge: setCachedItemAction.cachedItem }
          }
        });
      }

      case CachingActionType.unsetCachedItem: {
        const unsetCachedItemAction = action as UnsetCachedItemAction;
        if (selectCachedItem(state, unsetCachedItemAction.cachedItemKey) === undefined) {
          return state;
        }

        return updateCachingState(state, {
          caches: { $unset: [unsetCachedItemAction.cachedItemKey] }
        });
      }
    }

    return state;
  }
}
