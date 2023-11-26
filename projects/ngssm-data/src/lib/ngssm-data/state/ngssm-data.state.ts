import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { NgssmDataSourceValue } from '../model';

export const selectNgssmDataState = (state: State): NgssmDataState => state[NgssmDataStateSpecification.featureStateKey] as NgssmDataState;

export const updateNgssmDataState = (state: State, command: Spec<NgssmDataState, never>): State =>
  update(state, {
    [NgssmDataStateSpecification.featureStateKey]: command
  });

export interface NgssmDataState {
  dataSourceValues: { [key: string]: NgssmDataSourceValue };
}

@NgSsmFeatureState({
  featureStateKey: NgssmDataStateSpecification.featureStateKey,
  initialState: NgssmDataStateSpecification.initialState
})
export class NgssmDataStateSpecification {
  public static readonly featureStateKey = 'ngssm-data-state';
  public static readonly initialState: NgssmDataState = {
    dataSourceValues: {}
  };
}
