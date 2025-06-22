import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmRemoteCallActionType, SetRemoteCallAction } from '../actions';
import { updateNgssmRemoteCallState } from '../ngssm-remote-call.state';

@Injectable()
export class RemoteCallSetterReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmRemoteCallActionType.setRemoteCall];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmRemoteCallActionType.setRemoteCall: {
        const setRemoteCallAction = action as SetRemoteCallAction;
        return updateNgssmRemoteCallState(state, {
          remoteCalls: {
            [setRemoteCallAction.remoteCallId]: { $set: setRemoteCallAction.remoteCall }
          }
        });
      }
    }

    return state;
  }
}
