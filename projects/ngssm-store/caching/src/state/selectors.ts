import { State } from 'ngssm-store';
import { CachedItem } from '../model';
import { selectNgssmCachingState } from './ngssm-caching.state';

export const selectNgssmCachedItem = <T>(state: State, key: string): CachedItem<T> | undefined =>
  selectNgssmCachingState(state).caches[key];
