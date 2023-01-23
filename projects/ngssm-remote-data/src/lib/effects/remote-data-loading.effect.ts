import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';

import { LoadRemoteDataAction, RegisterLoadedRemoteDataAction, RemoteDataActionType } from '../actions';
import { DataStatus } from '../model';
import { RemoteDataProvider, NGSSM_REMOTE_DATA_PROVIDER } from '../remote-data-provider';
import { selectRemoteDataState } from '../state';

@Injectable()
export class RemoteDataLoadingEffect implements Effect {
  private readonly remoteDataProvidersPerKey: Map<string, RemoteDataProvider>;

  public readonly processedActions: string[] = [RemoteDataActionType.loadRemoteData];

  constructor(@Inject(NGSSM_REMOTE_DATA_PROVIDER) @Optional() remoteDataProviders: RemoteDataProvider[]) {
    this.remoteDataProvidersPerKey = new Map<string, RemoteDataProvider>((remoteDataProviders ?? []).map((r) => [r.remoteDataKey, r]));
  }

  public processAction(store: Store, state: State, action: Action): void {
    const loadRemoteDataAction = action as LoadRemoteDataAction;
    const item = selectRemoteDataState(state)[loadRemoteDataAction.remoteDataKey];
    const provider = this.remoteDataProvidersPerKey.get(loadRemoteDataAction.remoteDataKey);

    if (!item || !provider || item.status !== DataStatus.loading) {
      return;
    }

    provider.get().subscribe({
      next: (value) =>
        store.dispatchAction(new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.loaded, value)),
      error: (error) => {
        console.error(`Unable to load data for '${loadRemoteDataAction.remoteDataKey}'`, error);
        store.dispatchAction(new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.error, undefined));
      }
    });
  }
}

export const remoteDataLoadingEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: RemoteDataLoadingEffect,
  multi: true
};
