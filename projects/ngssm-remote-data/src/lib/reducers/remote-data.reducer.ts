import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { Reducer, State, NGSSM_REDUCER, Action } from 'ngssm-store';

import { LoadRemoteDataAction, RegisterLoadedRemoteDataAction, RemoteDataActionType } from '../actions';
import { DataStatus, RemoteDataProvider, NGSSM_REMOTE_DATA_PROVIDER } from '../model';
import { selectRemoteDataState, updateRemoteDataState } from '../state';

@Injectable()
export class RemoteDataReducer implements Reducer {
  private readonly remoteDataProvidersPerKey: Map<string, RemoteDataProvider>;

  public readonly processedActions: string[] = [RemoteDataActionType.loadRemoteData, RemoteDataActionType.registerLoadedRemoteData];

  constructor(@Inject(NGSSM_REMOTE_DATA_PROVIDER) @Optional() remoteDataProviders: RemoteDataProvider[]) {
    this.remoteDataProvidersPerKey = new Map<string, RemoteDataProvider>((remoteDataProviders ?? []).map((r) => [r.remoteDataKey, r]));
  }

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case RemoteDataActionType.loadRemoteData:
        const loadRemoteDataAction = action as LoadRemoteDataAction;
        const item = selectRemoteDataState(state)[loadRemoteDataAction.remoteDataKey];
        const provider = this.remoteDataProvidersPerKey.get(loadRemoteDataAction.remoteDataKey);

        if (
          !provider ||
          !provider.cacheDurationInSeconds ||
          loadRemoteDataAction.forceReload ||
          item.status === DataStatus.none ||
          item.status === DataStatus.error ||
          !item.timestamp ||
          new Date().getTime() - item.timestamp.getTime() >= 1000 * provider.cacheDurationInSeconds
        ) {
          return updateRemoteDataState(state, {
            [loadRemoteDataAction.remoteDataKey]: {
              status: { $set: DataStatus.loading }
            }
          });
        }

        break;

      case RemoteDataActionType.registerLoadedRemoteData:
        const registerLoadedRemoteDataAction = action as RegisterLoadedRemoteDataAction;
        if (this.remoteDataProvidersPerKey.has(registerLoadedRemoteDataAction.remoteDataKey)) {
          return updateRemoteDataState(state, {
            [registerLoadedRemoteDataAction.remoteDataKey]: {
              status: { $set: registerLoadedRemoteDataAction.status },
              data: { $set: registerLoadedRemoteDataAction.data },
              timestamp: { $set: new Date() },
              message: { $set: registerLoadedRemoteDataAction.message },
              error: { $set: registerLoadedRemoteDataAction.remoteCallError }
            }
          });
        }

        break;
    }

    return state;
  }
}

export const remoteDataReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: RemoteDataReducer,
  multi: true
};
