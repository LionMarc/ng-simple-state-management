import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { NavigationActionType } from '../actions';
import { NavigationLockingConfig, NGSSM_NAVIGATION_LOCKING_CONFIG } from '../model';
import { updateNavigationState } from '../state';

@Injectable()
export class NavigationReducer implements Reducer {
  private readonly lockingActions: Set<string>;
  private readonly unlockingActions: Set<string>;

  public readonly processedActions: string[] = [];

  constructor(
    @Inject(NGSSM_NAVIGATION_LOCKING_CONFIG)
    @Optional()
    configs: NavigationLockingConfig[]
  ) {
    this.lockingActions = new Set<string>([NavigationActionType.lockNavigation]);
    this.unlockingActions = new Set<string>([NavigationActionType.unLockNavigation]);

    (configs ?? []).forEach((config) => {
      (config.actionsLockingNavigation ?? []).forEach((command) => this.lockingActions.add(command));
      (config.actionsUnLockingNavigation ?? []).forEach((command) => this.unlockingActions.add(command));
    });

    this.processedActions = [...this.lockingActions, ...this.unlockingActions];
  }

  public updateState(state: State, action: Action): State {
    if (this.lockingActions.has(action.type)) {
      return updateNavigationState(state, {
        navigationLocked: { $set: true }
      });
    }

    if (this.unlockingActions.has(action.type)) {
      return updateNavigationState(state, {
        navigationLocked: { $set: false }
      });
    }

    return state;
  }
}

export const navigationReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: NavigationReducer,
  multi: true
};
