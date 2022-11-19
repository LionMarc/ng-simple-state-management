import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { LockNavigationBarAction, ShellActionType } from '../actions';
import { selectShellState, updateShellState } from '../state';

@Injectable()
export class NavigationBarReducer implements Reducer {
  public readonly processedActions: string[] = [
    ShellActionType.toggleNavigationBarState,
    ShellActionType.openNavigationBar,
    ShellActionType.closeNavigationBar,
    ShellActionType.lockNavigationBar
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case ShellActionType.toggleNavigationBarState:
        return updateShellState(state, {
          navigationBarOpen: { $apply: (value) => !value }
        });

      case ShellActionType.openNavigationBar:
        if (selectShellState(state).navigationBarOpen) {
          return state;
        }

        return updateShellState(state, {
          navigationBarOpen: { $set: true }
        });

      case ShellActionType.closeNavigationBar:
        if (!selectShellState(state).navigationBarOpen) {
          return state;
        }

        return updateShellState(state, {
          navigationBarOpen: { $set: false }
        });

      case ShellActionType.lockNavigationBar:
        const lockNavigationBarAction = action as LockNavigationBarAction;
        return updateShellState(state, {
          navigationBarLockStatus: { $set: lockNavigationBarAction.lockStatus }
        });
    }

    return state;
  }
}

export const navigationBarReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: NavigationBarReducer,
  multi: true
};
