import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgssmNotificationErrorComponent } from './ngssm-notification-error/ngssm-notification-error.component';
import { NgssmNotificationSuccessComponent } from './ngssm-notification-success/ngssm-notification-success.component';

@Injectable({
  providedIn: 'root'
})
export class NgssmNotifierService {
  private readonly matSnackBar = inject(MatSnackBar);

  public notifyError(message: string, detail?: string): void {
    this.matSnackBar.openFromComponent(NgssmNotificationErrorComponent, {
      panelClass: 'ngssm-notification-panel',
      data: detail ? `${message}: ${detail}` : message
    });
  }

  public notifySuccess(message: string): void {
    this.matSnackBar.openFromComponent(NgssmNotificationSuccessComponent, {
      panelClass: 'ngssm-notification-panel',
      data: message
    });
  }
}
