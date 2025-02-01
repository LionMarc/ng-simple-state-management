import { Action } from 'ngssm-store';

import { NgssmCachingActionType } from './ngssm-caching-action-type';
import { CachedItem } from '../model';

export class SetCachedItemAction<TData = never> implements Action {
  public readonly type: string = NgssmCachingActionType.setCachedItem;

  constructor(
    public readonly cachedItemKey: string,
    public readonly cachedItem: Partial<CachedItem<TData>>
  ) {}
}
