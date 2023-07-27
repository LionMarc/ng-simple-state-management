import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';

import { NgssmConfirmationDialogConfig } from '../ngssm-confirmation-dialog-config';

@Component({
  selector: 'ngssm-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './ngssm-confirmation-dialog.component.html',
  styleUrls: ['./ngssm-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmConfirmationDialogComponent extends NgSsmComponent {
  constructor(
    store: Store,
    @Inject(MAT_DIALOG_DATA) public data: NgssmConfirmationDialogConfig
  ) {
    super(store);
  }
}
