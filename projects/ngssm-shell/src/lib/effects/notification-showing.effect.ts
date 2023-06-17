import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Effect, Store, State, Action } from 'ngssm-store';

import { ShellActionType } from '../actions';
import { ShellNotificationPopupComponent } from '../components';

@Injectable()
export class NotificationShowingEffect implements Effect {
  public readonly processedActions: string[] = [ShellActionType.displayNotification];

  constructor(private snackBar: MatSnackBar) {}

  public processAction(store: Store, state: State, action: Action): void {
    this.snackBar.openFromComponent(ShellNotificationPopupComponent, {
      panelClass: 'ngssm-shell-notification-snack-panel',
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
