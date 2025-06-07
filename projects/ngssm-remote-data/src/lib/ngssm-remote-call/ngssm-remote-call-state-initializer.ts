import { inject, Injectable } from '@angular/core';

import { State, StateInitializer } from 'ngssm-store';

import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig, RemoteCallStatus } from './model';
import { updateNgssmRemoteCallState } from './state';

@Injectable()
export class NgssmRemoteCallStateInitializer implements StateInitializer {
  private readonly remoteCallConfigs: RemoteCallConfig[] | null = inject(NGSSM_REMOTE_CALL_CONFIG, {
    optional: true
  }) as unknown as RemoteCallConfig[];

  public initializeState(state: State): State {
    const tempState = state;
    return (this.remoteCallConfigs ?? []).reduce(
      (s, config) => updateNgssmRemoteCallState(s, { remoteCalls: { [config.id]: { $set: { status: RemoteCallStatus.none } } } }),
      tempState
    );
  }
}
