import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';
import { LockStatus } from '../model';
import { getDefaultShellNotifications, ShellNotifications } from './shell-notifications';

export const selectShellState = (state: State): ShellState => state[ShellStateSpecification.featureStateKey] as ShellState;

export const updateShellState = (state: State, command: Spec<ShellState, never>): State =>
  update(state, {
    [ShellStateSpecification.featureStateKey]: command
  });

export interface ShellState {
  navigationBarOpen: boolean;
  navigationBarLockStatus: LockStatus;
  shellNotifications: ShellNotifications;
}

@NgSsmFeatureState({
  featureStateKey: ShellStateSpecification.featureStateKey,
  initialState: ShellStateSpecification.initialState
})
export class ShellStateSpecification {
  public static readonly featureStateKey = 'shell-state';
  public static readonly initialState: ShellState = {
    navigationBarOpen: true,
    navigationBarLockStatus: LockStatus.notLocked,
    shellNotifications: getDefaultShellNotifications()
  };
}
