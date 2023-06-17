import { Injectable } from '@angular/core';
import { updateRemoteDataState } from 'ngssm-remote-data';
import { Reducer, State, Action } from 'ngssm-store';

import { RemoteDataDemoActionType, UpdateDataStatusAction } from '../actions';

@Injectable()
export class RemoteDataDemoReducer implements Reducer {
  public readonly processedActions: string[] = [RemoteDataDemoActionType.updateDataStatus];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case RemoteDataDemoActionType.updateDataStatus: {
        const updateDataStatusAction = action as UpdateDataStatusAction;
        return updateRemoteDataState(state, {
          [updateDataStatusAction.key]: {
            $set: {
              status: updateDataStatusAction.status
            }
          }
        });
      }
    }
    return state;
  }
}
