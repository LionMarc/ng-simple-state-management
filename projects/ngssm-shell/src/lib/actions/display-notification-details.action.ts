import { Action } from 'ngssm-store';
import { ShellActionType } from './shell-action-type';

export class DisplayNotificationDetailsAction implements Action {
  public readonly type: string = ShellActionType.displayNotificationDetails;

  constructor(public readonly notificationIndex: number | undefined) {}
}
