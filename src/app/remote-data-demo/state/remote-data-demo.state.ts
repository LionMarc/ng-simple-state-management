import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectRemoteDataDemoState = (state: State): RemoteDataDemoState =>
  state[RemoteDataDemoStateSpecification.featureStateKey] as RemoteDataDemoState;

export const updateRemoteDataDemoState = (state: State, command: Spec<RemoteDataDemoState, never>): State =>
  update(state, {
    [RemoteDataDemoStateSpecification.featureStateKey]: command
  });

export interface RemoteDataDemoState {}

@NgSsmFeatureState({
  featureStateKey: RemoteDataDemoStateSpecification.featureStateKey,
  initialState: RemoteDataDemoStateSpecification.initialState
})
export class RemoteDataDemoStateSpecification {
  public static readonly featureStateKey = 'remote-data-demo-state';
  public static readonly initialState: RemoteDataDemoState = {};
}
