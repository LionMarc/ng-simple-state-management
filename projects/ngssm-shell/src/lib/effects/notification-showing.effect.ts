import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Effect } from 'ngssm-store';

import { ShellActionType } from '../actions';
import { ShellNotificationPopupComponent } from '../components';

@Injectable()
export class NotificationShowingEffect implements Effect {
  private readonly snackBar = inject(MatSnackBar);

  public readonly processedActions: string[] = [ShellActionType.displayNotification];

  public processAction(): void {
    this.snackBar.openFromComponent(ShellNotificationPopupComponent, {
      panelClass: 'ngssm-shell-notification-snack-panel',
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
