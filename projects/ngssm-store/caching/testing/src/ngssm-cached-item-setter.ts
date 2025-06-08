import { inject, Injectable } from '@angular/core';

import { Store } from 'ngssm-store';
import { CachedItemStatus, SetCachedItemAction, updateNgssmCachingState } from 'ngssm-store/caching';
import { StoreMock } from 'ngssm-store/testing';

/**
 * Utility service for setting and updating cached items in the StoreMock during tests.
 * Provides methods to apply a SetCachedItemAction, set the status, or set the value of a cached item.
 */
@Injectable()
export class NgssmCachedItemSetter {
  public readonly store = inject(Store) as unknown as StoreMock;

  /**
   * Applies a SetCachedItemAction to the StoreMock, updating the cache state.
   * @param action The SetCachedItemAction to apply.
   * @returns The NgssmCachedItemSetter instance for chaining.
   */
  public apply<T = unknown>(action: SetCachedItemAction<T>): NgssmCachedItemSetter {
    this.store.stateValue = updateNgssmCachingState(this.store.stateValue, {
      caches: {
        [action.cachedItemKey]: {
          $set: {
            status: action.status,
            item: action.cachedItem,
            error: action.error
          }
        }
      }
    });

    return this;
  }

  /**
   * Sets the status of a cached item in the StoreMock.
   * @param cacheItemKey The key of the cached item.
   * @param status The new status to set.
   * @returns The NgssmCachedItemSetter instance for chaining.
   */
  public setCacheItemStatus(cacheItemKey: string, status: CachedItemStatus): NgssmCachedItemSetter {
    this.store.stateValue = updateNgssmCachingState(this.store.stateValue, {
      caches: {
        [cacheItemKey]: {
          status: { $set: status }
        }
      }
    });

    return this;
  }

  /**
   * Sets the value of a cached item in the StoreMock.
   * @param cacheItemKey The key of the cached item.
   * @param value The value to set.
   * @returns The NgssmCachedItemSetter instance for chaining.
   */
  public setCacheItemValue<T>(cacheItemKey: string, value?: T): NgssmCachedItemSetter {
    this.store.stateValue = updateNgssmCachingState(this.store.stateValue, {
      caches: {
        [cacheItemKey]: {
          item: { $set: value }
        }
      }
    });

    return this;
  }
}
