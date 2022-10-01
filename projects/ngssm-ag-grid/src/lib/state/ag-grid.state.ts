import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { GridState } from './grid-state';
import { SelectedRows } from './selected-rows';

export const selectAgGridState = (state: State): AgGridState => state[AgGridStateSpecification.featureStateKey] as AgGridState;

export const updateAgGridState = (state: State, command: Spec<AgGridState, never>): State =>
  update(state, {
    [AgGridStateSpecification.featureStateKey]: command
  });

export interface AgGridState {
  gridStates: { [key: string]: GridState };
  selectedRows: { [key: string]: SelectedRows };
}

@NgSsmFeatureState({
  featureStateKey: AgGridStateSpecification.featureStateKey,
  initialState: AgGridStateSpecification.initialState
})
export class AgGridStateSpecification {
  public static readonly featureStateKey = 'ag-grid-state';
  public static readonly initialState: AgGridState = {
    gridStates: {},
    selectedRows: {}
  };
}
