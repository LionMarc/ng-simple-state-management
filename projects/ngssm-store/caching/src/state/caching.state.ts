import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { CachedItem } from '../model';

export const selectCachingState = (state: State): CachingState => state[CachingStateSpecification.featureStateKey] as CachingState;

export const updateCachingState = (state: State, command: Spec<CachingState, never>): State =>
  update(state, {
    [CachingStateSpecification.featureStateKey]: command
  });

export interface CachingState {
  caches: { [key: string]: CachedItem };
}

@NgSsmFeatureState({
  featureStateKey: CachingStateSpecification.featureStateKey,
  initialState: CachingStateSpecification.initialState
})
export class CachingStateSpecification {
  public static readonly featureStateKey = 'caching-state';
  public static readonly initialState: CachingState = {
    caches: {}
  };
}
