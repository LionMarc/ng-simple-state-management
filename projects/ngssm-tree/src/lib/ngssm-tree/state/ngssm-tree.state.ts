import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

import { NgssmTree } from '../model';
import { getDefaultTreeNodesSearch, TreeNodesSearch } from './tree-nodes-search';

export const selectNgssmTreeState = (state: State): NgssmTreeState => state[NgssmTreeStateSpecification.featureStateKey] as NgssmTreeState;

export const updateNgssmTreeState = (state: State, command: Spec<NgssmTreeState, never>): State =>
  update(state, {
    [NgssmTreeStateSpecification.featureStateKey]: command
  });

export interface NgssmTreeState {
  trees: Record<string, NgssmTree>;
  treeNodesSearch: TreeNodesSearch;
}

@NgSsmFeatureState({
  featureStateKey: NgssmTreeStateSpecification.featureStateKey,
  initialState: NgssmTreeStateSpecification.initialState
})
export class NgssmTreeStateSpecification {
  public static readonly featureStateKey = 'ngssm-tree-state';
  public static readonly initialState: NgssmTreeState = {
    trees: {},
    treeNodesSearch: getDefaultTreeNodesSearch()
  };
}
