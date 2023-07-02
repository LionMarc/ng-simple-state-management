import { Action } from 'ngssm-store';
import { NgssmCachingActionType } from './ngssm-caching-action-type';

export class UnsetCachedItemAction implements Action {
  public readonly type: string = NgssmCachingActionType.unsetCachedItem;

  constructor(public readonly cachedItemKey: string) {}
}
