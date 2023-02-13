import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { NgssmTree } from '../model';

export const selectNgssmTreeState = (state: State): NgssmTreeState => state[NgssmTreeStateSpecification.featureStateKey] as NgssmTreeState;

export const updateNgssmTreeState = (state: State, command: Spec<NgssmTreeState, never>): State =>
  update(state, {
    [NgssmTreeStateSpecification.featureStateKey]: command
  });

export interface NgssmTreeState {
  trees: { [key: string]: NgssmTree };
}

@NgSsmFeatureState({
  featureStateKey: NgssmTreeStateSpecification.featureStateKey,
  initialState: NgssmTreeStateSpecification.initialState
})
export class NgssmTreeStateSpecification {
  public static readonly featureStateKey = 'ngssm-tree-state';
  public static readonly initialState: NgssmTreeState = {
    trees: {}
  };
}
