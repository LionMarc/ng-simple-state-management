import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';
import { NgssmRemoteCallResultAction } from '../actions';

import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig, RemoteCallStatus } from '../model';
import { updateNgssmRemoteCallState } from '../state';

@Injectable()
export class RemoteCallReducer implements Reducer {
  public readonly processedActions: string[] = [];

  constructor(@Inject(NGSSM_REMOTE_CALL_CONFIG) @Optional() private remoteCallConfigs: RemoteCallConfig[]) {
    (this.remoteCallConfigs ?? []).forEach((c) => this.processedActions.push(...[c.triggeredActionType, c.resultActionType]));
  }

  public updateState(state: State, action: Action): State {
    const config = (this.remoteCallConfigs ?? []).find((c) => c.triggeredActionType === action.type || c.resultActionType === action.type);
    if (config) {
      if (action.type === config.triggeredActionType) {
        return updateNgssmRemoteCallState(state, {
          remoteCalls: {
            [config.id]: {
              status: { $set: RemoteCallStatus.inProgress }
            }
          }
        });
      }

      const ngssmRemoteCallResultAction = action as NgssmRemoteCallResultAction;
      return updateNgssmRemoteCallState(state, {
        remoteCalls: {
          [config.id]: { $set: ngssmRemoteCallResultAction.remoteCall }
        }
      });
    }

    return state;
  }
}

export const remoteCallReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: RemoteCallReducer,
  multi: true
};
