import { State } from 'ngssm-store';
import { CachedItem } from '../model';
import { selectNgssmCachingState } from './ngssm-caching.state';

export const selectNgssmCachedItem = <T = unknown>(state: State, key: string): CachedItem<T> | undefined =>
  selectNgssmCachingState(state).caches[key] as CachedItem<T>;
