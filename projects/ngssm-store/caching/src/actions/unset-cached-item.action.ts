import { Action } from 'ngssm-store';
import { CachingActionType } from './caching-action-type';

export class UnsetCachedItemAction implements Action {
  public readonly type: string = CachingActionType.unsetCachedItem;

  constructor(public readonly cachedItemKey: string) {}
}
