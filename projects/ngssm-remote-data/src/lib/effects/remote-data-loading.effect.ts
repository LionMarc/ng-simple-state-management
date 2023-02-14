import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { LoadRemoteDataAction, RegisterLoadedRemoteDataAction, RemoteDataActionType } from '../actions';
import { DataStatus, RemoteDataProvider, NGSSM_REMOTE_DATA_PROVIDER } from '../model';
import { selectRemoteDataState } from '../state';

@Injectable()
export class RemoteDataLoadingEffect implements Effect {
  private readonly remoteDataProvidersPerKey: Map<string, RemoteDataProvider>;

  public readonly processedActions: string[] = [RemoteDataActionType.loadRemoteData];

  constructor(
    @Inject(NGSSM_REMOTE_DATA_PROVIDER) @Optional() remoteDataProviders: RemoteDataProvider[],
    private notifierService: NgssmNotifierService
  ) {
    this.remoteDataProvidersPerKey = new Map<string, RemoteDataProvider>((remoteDataProviders ?? []).map((r) => [r.remoteDataKey, r]));
  }

  public processAction(store: Store, state: State, action: Action): void {
    const loadRemoteDataAction = action as LoadRemoteDataAction;
    const item = selectRemoteDataState(state)[loadRemoteDataAction.remoteDataKey];
    const provider = this.remoteDataProvidersPerKey.get(loadRemoteDataAction.remoteDataKey);

    if (!item || !provider || item.status !== DataStatus.loading) {
      return;
    }

    provider.get(loadRemoteDataAction.params).subscribe({
      next: (value) => {
        store.dispatchAction(new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.loaded, value));
        if (loadRemoteDataAction.params?.callbackAction) {
          store.dispatchActionType(loadRemoteDataAction.params.callbackAction);
        }
      },
      error: (error) => {
        console.error(`Unable to load data for '${loadRemoteDataAction.remoteDataKey}'`, error);
        if (loadRemoteDataAction.params?.errorNotificationMessage) {
          this.notifierService.notifyError(loadRemoteDataAction.params.errorNotificationMessage(error?.error));
        }

        store.dispatchAction(
          new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.error, undefined, error?.error)
        );
      }
    });
  }
}

export const remoteDataLoadingEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: RemoteDataLoadingEffect,
  multi: true
};
