import { Inject, Injectable, Optional } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

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
        if (!item) {
          return state;
        }

        const provider = this.remoteDataProvidersPerKey.get(loadRemoteDataAction.remoteDataKey);
        if (!provider) {
          return state;
        }

        if (
          !provider.cacheDurationInSeconds ||
          loadRemoteDataAction.params?.forceReload === true ||
          item.status === DataStatus.none ||
          item.status === DataStatus.error ||
          item.status === DataStatus.notFound ||
          !item.timestamp ||
          new Date().getTime() - item.timestamp.getTime() >= 1000 * provider.cacheDurationInSeconds
        ) {
          return updateRemoteDataState(state, {
            [loadRemoteDataAction.remoteDataKey]: {
              status: { $set: DataStatus.loading },
              getterParams: {
                $apply: (value) => {
                  if (!loadRemoteDataAction.params || loadRemoteDataAction.params.keepStoredGetterParams !== true) {
                    return loadRemoteDataAction.params?.params;
                  }

                  return value;
                }
              }
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
