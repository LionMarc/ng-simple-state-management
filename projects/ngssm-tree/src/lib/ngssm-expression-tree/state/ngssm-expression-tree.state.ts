import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { NgssmExpressionTree } from '../model';

export const selectNgssmExpressionTreeState = (state: State): NgssmExpressionTreeState =>
  state[NgssmExpressionTreeStateSpecification.featureStateKey] as NgssmExpressionTreeState;

export const updateNgssmExpressionTreeState = (state: State, command: Spec<NgssmExpressionTreeState, never>): State =>
  update(state, {
    [NgssmExpressionTreeStateSpecification.featureStateKey]: command
  });

export interface NgssmExpressionTreeState {
  trees: Record<string, NgssmExpressionTree>;
}

@NgSsmFeatureState({
  featureStateKey: NgssmExpressionTreeStateSpecification.featureStateKey,
  initialState: NgssmExpressionTreeStateSpecification.initialState
})
export class NgssmExpressionTreeStateSpecification {
  public static readonly featureStateKey = 'ngssm-expression-tree-state';
  public static readonly initialState: NgssmExpressionTreeState = {
    trees: {}
  };
}
