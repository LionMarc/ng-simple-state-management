import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { CachedItem } from '../model';

export const selectNgssmCachingState = (state: State): NgssmCachingState =>
  state[NgssmCachingStateSpecification.featureStateKey] as NgssmCachingState;

export const updateNgssmCachingState = (state: State, command: Spec<NgssmCachingState, never>): State =>
  update(state, {
    [NgssmCachingStateSpecification.featureStateKey]: command
  });

export interface NgssmCachingState {
  caches: { [key: string]: CachedItem };
}

@NgSsmFeatureState({
  featureStateKey: NgssmCachingStateSpecification.featureStateKey,
  initialState: NgssmCachingStateSpecification.initialState
})
export class NgssmCachingStateSpecification {
  public static readonly featureStateKey = 'ngssm-caching-state';
  public static readonly initialState: NgssmCachingState = {
    caches: {}
  };
}
