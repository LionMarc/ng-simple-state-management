import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { NgssmConfirmationDialogConfig } from './ngssm-confirmation-dialog-config';
import { NgssmConfirmationDialogComponent } from './ngssm-confirmation-dialog/ngssm-confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NgssmConfirmationDialogService {
  constructor(private matDialog: MatDialog) {}

  public displayConfirmationDialog(config: NgssmConfirmationDialogConfig): Observable<string> {
    return this.matDialog
      .open(NgssmConfirmationDialogComponent, {
        disableClose: true,
        data: config,
        minWidth: config.minWidth,
        minHeight: config.minHeight
      })
      .afterClosed();
  }
}
