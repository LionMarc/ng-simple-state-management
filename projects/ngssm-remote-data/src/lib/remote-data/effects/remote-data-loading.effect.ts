import { EnvironmentInjector, Injectable, runInInjectionContext, inject } from '@angular/core';

import { Effect, State, Action, ActionDispatcher } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { LoadRemoteDataAction, RegisterLoadedRemoteDataAction, RemoteDataActionType } from '../actions';
import { DataStatus, RemoteDataProvider, NGSSM_REMOTE_DATA_PROVIDER } from '../model';
import { selectRemoteDataState } from '../state';

@Injectable()
export class RemoteDataLoadingEffect implements Effect {
  private readonly remoteDataProviders: RemoteDataProvider[] | null = inject(NGSSM_REMOTE_DATA_PROVIDER, {
    optional: true
  }) as unknown as RemoteDataProvider[];
  private readonly notifierService = inject(NgssmNotifierService);
  private readonly injector = inject(EnvironmentInjector);

  private readonly remoteDataProvidersPerKey: Map<string, RemoteDataProvider>;

  public readonly processedActions: string[] = [RemoteDataActionType.loadRemoteData];

  constructor() {
    this.remoteDataProvidersPerKey = new Map<string, RemoteDataProvider>((this.remoteDataProviders ?? []).map((r) => [r.remoteDataKey, r]));
  }

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    const loadRemoteDataAction = action as LoadRemoteDataAction;
    const item = selectRemoteDataState(state)[loadRemoteDataAction.remoteDataKey];
    const provider = this.remoteDataProvidersPerKey.get(loadRemoteDataAction.remoteDataKey);

    if (!item || !provider || item.status !== DataStatus.loading) {
      return;
    }

    runInInjectionContext(this.injector, () => {
      provider.get(item.getterParams).subscribe({
        next: (value) => {
          actiondispatcher.dispatchAction(new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.loaded, value));
          if (item.getterParams?.callbackAction) {
            actiondispatcher.dispatchActionType(item.getterParams.callbackAction);
          }
        },
        error: (error) => {
          console.error(`Unable to load data for '${loadRemoteDataAction.remoteDataKey}'`, error);
          if (item.getterParams?.errorNotificationMessage) {
            this.notifierService.notifyError(item.getterParams.errorNotificationMessage(error?.error));
          }

          actiondispatcher.dispatchAction(
            new RegisterLoadedRemoteDataAction(loadRemoteDataAction.remoteDataKey, DataStatus.error, undefined, error?.error)
          );
        }
      });
    });
  }
}
