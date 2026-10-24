import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { GridState } from './grid-state';
import { SelectedRows } from './selected-rows';

export const selectNgssmAgGridState = (state: State): NgssmAgGridState =>
  state[NgssmAgGridStateSpecification.featureStateKey] as NgssmAgGridState;

export const updateNgssmAgGridState = (state: State, command: Spec<NgssmAgGridState, never>): State =>
  update(state, {
    [NgssmAgGridStateSpecification.featureStateKey]: command
  });

export interface NgssmAgGridState {
  gridStates: Record<string, GridState>;
  selectedRows: Record<string, SelectedRows>;
}

@NgSsmFeatureState({
  featureStateKey: NgssmAgGridStateSpecification.featureStateKey,
  initialState: NgssmAgGridStateSpecification.initialState
})
export class NgssmAgGridStateSpecification {
  public static readonly featureStateKey = 'ngssm-ag-grid-state';
  public static readonly initialState: NgssmAgGridState = {
    gridStates: {},
    selectedRows: {}
  };
}
