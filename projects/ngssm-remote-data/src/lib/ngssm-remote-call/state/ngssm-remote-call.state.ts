import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

import { RemoteCall } from '../model';

export const selectNgssmRemoteCallState = (state: State): NgssmRemoteCallState =>
  state[NgssmRemoteCallStateSpecification.featureStateKey] as NgssmRemoteCallState;

export const updateNgssmRemoteCallState = (state: State, command: Spec<NgssmRemoteCallState, never>): State =>
  update(state, {
    [NgssmRemoteCallStateSpecification.featureStateKey]: command
  });

export interface NgssmRemoteCallState {
  remoteCalls: { [key: string]: RemoteCall };
}

@NgSsmFeatureState({
  featureStateKey: NgssmRemoteCallStateSpecification.featureStateKey,
  initialState: NgssmRemoteCallStateSpecification.initialState
})
export class NgssmRemoteCallStateSpecification {
  public static readonly featureStateKey = 'ngssm-remote-call-state';
  public static readonly initialState: NgssmRemoteCallState = {
    remoteCalls: {}
  };
}
