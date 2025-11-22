import { inject, Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NGSSM_REMOTE_CALL_CONFIG, NgssmRemoteCallResultAction, RemoteCallConfig } from '../register-remote-call';
import { getDefaultRemoteCall, RemoteCallStatus } from '../remote-call';
import { updateNgssmRemoteCallState } from '../ngssm-remote-call.state';

@Injectable()
export class RemoteCallReducer implements Reducer {
  public readonly processedActions: string[] = [];

  private readonly remoteCallConfigs: RemoteCallConfig[] | null = inject(NGSSM_REMOTE_CALL_CONFIG, {
    optional: true
  }) as unknown as RemoteCallConfig[];

  constructor() {
    (this.remoteCallConfigs ?? []).forEach((c) => this.processedActions.push(...[...c.triggeredActionTypes, ...c.resultActionTypes]));
  }

  public updateState(state: State, action: Action): State {
    const configs = (this.remoteCallConfigs ?? []).filter(
      (c) => c.triggeredActionTypes.includes(action.type) || c.resultActionTypes.includes(action.type)
    );
    let output = state;
    configs.forEach((config) => {
      if (config.triggeredActionTypes.includes(action.type)) {
        output = updateNgssmRemoteCallState(output, {
          remoteCalls: {
            [config.id]: { $set: getDefaultRemoteCall(RemoteCallStatus.inProgress) }
          }
        });
      } else {
        const ngssmRemoteCallResultAction = action as NgssmRemoteCallResultAction;
        output = updateNgssmRemoteCallState(output, {
          remoteCalls: {
            [config.id]: { $set: ngssmRemoteCallResultAction.remoteCall }
          }
        });
      }
    });

    return output;
  }
}
