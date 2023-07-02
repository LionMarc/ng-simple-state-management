import { State } from 'ngssm-store';
import { CachedItem } from '../model';
import { selectCachingState } from './caching.state';

export const selectCachedItem = <T>(state: State, key: string): CachedItem<T> | undefined => selectCachingState(state).caches[key];
