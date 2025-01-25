import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

import { RemoteData } from '../model';

export const selectRemoteDataState = (state: State): RemoteDataState =>
  state[RemoteDataStateSpecification.featureStateKey] as RemoteDataState;

export const updateRemoteDataState = (state: State, command: Spec<RemoteDataState, never>): State =>
  update(state, {
    [RemoteDataStateSpecification.featureStateKey]: command
  });

export type RemoteDataState = Record<string, RemoteData<unknown>>;

@NgSsmFeatureState({
  featureStateKey: RemoteDataStateSpecification.featureStateKey,
  initialState: RemoteDataStateSpecification.initialState
})
export class RemoteDataStateSpecification {
  public static readonly featureStateKey = 'remote-data-state';
  public static readonly initialState: RemoteDataState = {};
}
