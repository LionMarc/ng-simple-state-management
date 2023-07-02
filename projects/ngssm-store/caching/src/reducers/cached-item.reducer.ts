import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmCachingActionType, SetCachedItemAction, UnsetCachedItemAction } from '../actions';
import { selectNgssmCachedItem, updateNgssmCachingState } from '../state';
import { CachedItem, CachedItemStatus } from '../model';

@Injectable()
export class CachedItemReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmCachingActionType.setCachedItem, NgssmCachingActionType.unsetCachedItem];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmCachingActionType.setCachedItem: {
        const setCachedItemAction = action as SetCachedItemAction;
        if (selectNgssmCachedItem(state, setCachedItemAction.cachedItemKey) === undefined) {
          const cachedItem: CachedItem = {
            status: CachedItemStatus.notSet,
            ...setCachedItemAction.cachedItem
          };
          return updateNgssmCachingState(state, {
            caches: {
              [setCachedItemAction.cachedItemKey]: { $set: cachedItem }
            }
          });
        }

        return updateNgssmCachingState(state, {
          caches: {
            [setCachedItemAction.cachedItemKey]: { $merge: setCachedItemAction.cachedItem }
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
