import { Injectable, Provider } from '@angular/core';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { DisplayNotificationAction, DisplayNotificationDetailsAction, ShellActionType } from '../actions';
import { ShellNotification } from '../model';
import { updateShellState } from '../state';

@Injectable()
export class ShellNotificationsReducer implements Reducer {
  public readonly processedActions: string[] = [
    ShellActionType.displayNotification,
    ShellActionType.displayNotificationDetails,
    ShellActionType.clearAllNotifications
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case ShellActionType.displayNotification:
        const displayNotificationAction = action as DisplayNotificationAction;
        const notification: ShellNotification = {
          type: displayNotificationAction.notificationType,
          title: displayNotificationAction.title,
          details: displayNotificationAction.details,
          timestamp: new Date()
        };
        return updateShellState(state, {
          shellNotifications: {
            notifications: { $push: [notification] }
          }
        });

      case ShellActionType.displayNotificationDetails:
        const displayNotificationDetailsAction = action as DisplayNotificationDetailsAction;
        return updateShellState(state, {
          shellNotifications: {
            selectedNotificaitonIndex: { $set: displayNotificationDetailsAction.notificationIndex }
          }
        });

      case ShellActionType.clearAllNotifications:
        return updateShellState(state, {
          shellNotifications: {
            notifications: { $set: [] }
          }
        });
    }

    return state;
  }
}

export const shellNotificationsReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: ShellNotificationsReducer,
  multi: true
};
