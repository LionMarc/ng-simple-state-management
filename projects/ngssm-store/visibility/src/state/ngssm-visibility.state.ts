import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectNgssmVisibilityState = (state: State): NgssmVisibilityState =>
  state[NgssmVisibilityStateSpecification.featureStateKey] as NgssmVisibilityState;

export const updateNgssmVisibilityState = (state: State, command: Spec<NgssmVisibilityState, never>): State =>
  update(state, {
    [NgssmVisibilityStateSpecification.featureStateKey]: command
  });

export interface NgssmVisibilityState {
  elements: { [key: string]: boolean };
  elementsGroups: string[][];
}

@NgSsmFeatureState({
  featureStateKey: NgssmVisibilityStateSpecification.featureStateKey,
  initialState: NgssmVisibilityStateSpecification.initialState
})
export class NgssmVisibilityStateSpecification {
  public static readonly featureStateKey = 'ngssm-visibility-state';
  public static readonly initialState: NgssmVisibilityState = {
    elements: {},
    elementsGroups: []
  };
}
