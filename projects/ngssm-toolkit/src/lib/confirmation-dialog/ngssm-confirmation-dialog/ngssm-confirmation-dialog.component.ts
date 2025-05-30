import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { NgssmConfirmationDialogConfig } from '../ngssm-confirmation-dialog-config';

@Component({
  selector: 'ngssm-confirmation-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  templateUrl: './ngssm-confirmation-dialog.component.html',
  styleUrls: ['./ngssm-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmConfirmationDialogComponent {
  public readonly data = inject(MAT_DIALOG_DATA) as NgssmConfirmationDialogConfig;
}
