import { Action } from 'ngssm-store';

import { NgssmCachingActionType } from './ngssm-caching-action-type';
import { CachedItemStatus } from '../model';

/**
 * Represents an action to set a cached item in the state. If key is already set in the state, the value is replaced by the new one.
 *
 * @template TData The type of the cached item's data.
 * @implements {Action}
 *
 * @property {string} cachedItemKey - The unique key identifying the cached item.
 * @property {TData} cachedItem - The data to be cached.
 * @property {CachedItemStatus} [status=CachedItemStatus.set] - The status of the cached item operation.
 * @property {string} [error] - An optional error message if the caching operation failed.
 *
 * @remarks
 * This action is dispatched to update the cache with a new or modified item, along with its status and any error information.
 */
export class SetCachedItemAction<TData = never> implements Action {
  public readonly type: string = NgssmCachingActionType.setCachedItem;

  constructor(
    public readonly cachedItemKey: string,
    public readonly cachedItem: TData,
    public readonly status = CachedItemStatus.set,
    public readonly error?: string
  ) {}
}
