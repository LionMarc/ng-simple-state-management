import { Action } from 'ngssm-store';

import { CachingActionType } from './caching-action-type';
import { CachedItem } from '../model';

export class SetCachedItemAction<TData = any> implements Action {
  public readonly type: string = CachingActionType.setCachedItem;

  constructor(public readonly cachedItemKey: string, public readonly cachedItem: Partial<CachedItem<TData>>) {}
}
