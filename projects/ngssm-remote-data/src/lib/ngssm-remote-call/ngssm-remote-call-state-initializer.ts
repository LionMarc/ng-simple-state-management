import { Inject, Injectable, Optional } from '@angular/core';

import { State, StateInitializer } from 'ngssm-store';

import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig, RemoteCallStatus } from './model';
import { updateNgssmRemoteCallState } from './state';

@Injectable()
export class NgssmRemoteCallStateInitializer implements StateInitializer {
  constructor(@Inject(NGSSM_REMOTE_CALL_CONFIG) @Optional() private remoteCallConfigs: RemoteCallConfig[]) {}

  public initializeState(state: State): State {
    let tempState = state;
    return (this.remoteCallConfigs ?? []).reduce(
      (s, config) => updateNgssmRemoteCallState(s, { remoteCalls: { [config.id]: { $set: { status: RemoteCallStatus.none } } } }),
      tempState
    );
  }
}
