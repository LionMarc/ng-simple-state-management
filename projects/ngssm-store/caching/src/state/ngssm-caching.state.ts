import update, { CustomCommands, Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { CachedItem } from '../model';

export const selectNgssmCachingState = (state: State): NgssmCachingState =>
  state[NgssmCachingStateSpecification.featureStateKey] as NgssmCachingState;

export const updateNgssmCachingState = <T extends CustomCommands<object> = never>(
  state: State,
  command: Spec<NgssmCachingState, T>
): State =>
  update(state, {
    [NgssmCachingStateSpecification.featureStateKey]: command
  });

export interface NgssmCachingState {
  caches: Record<string, CachedItem>;
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
