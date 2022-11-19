import { Action } from 'ngssm-store';
import { LockStatus } from '../model';
import { ShellActionType } from './shell-action-type';

export class LockNavigationBarAction implements Action {
  public readonly type: string = ShellActionType.lockNavigationBar;

  constructor(public readonly lockStatus: LockStatus) {}
}
