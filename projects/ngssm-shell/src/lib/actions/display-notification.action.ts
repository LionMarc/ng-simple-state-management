import { Action } from 'ngssm-store';

import { ShellNotificationType } from '../model';
import { ShellActionType } from './shell-action-type';

export class DisplayNotificationAction implements Action {
  public readonly type: string = ShellActionType.displayNotification;

  constructor(public readonly notificationType: ShellNotificationType, public readonly title: string, public readonly details?: any) {}
}
