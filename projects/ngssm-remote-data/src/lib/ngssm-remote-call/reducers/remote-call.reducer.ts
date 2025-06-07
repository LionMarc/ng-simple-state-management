import { inject, Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmRemoteCallResultAction } from '../actions';
import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig, RemoteCallStatus, getDefaultRemoteCall } from '../model';
import { updateNgssmRemoteCallState } from '../state';

@Injectable()
export class RemoteCallReducer implements Reducer {
  private readonly remoteCallConfigs: RemoteCallConfig[] | null = inject(NGSSM_REMOTE_CALL_CONFIG, {
    optional: true
  }) as unknown as RemoteCallConfig[];

  public readonly processedActions: string[] = [];

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
