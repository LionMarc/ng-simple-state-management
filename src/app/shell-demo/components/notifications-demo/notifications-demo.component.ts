import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgssmAceEditorComponent, NgssmAceEditorMode } from 'ngssm-ace-editor';
import { DisplayNotificationAction, ShellNotificationType } from 'ngssm-shell';
import { Store } from 'ngssm-store';

@Component({
  selector: 'ngssm-notifications-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    NgssmAceEditorComponent
  ],
  templateUrl: './notifications-demo.component.html',
  styleUrls: ['./notifications-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsDemoComponent {
  private readonly store = inject(Store);

  private details: string | undefined;

  public readonly ngssmAceEditorMode = NgssmAceEditorMode;
  public readonly notificationTypes = [ShellNotificationType.success, ShellNotificationType.error];
  public readonly typeControl = new FormControl<ShellNotificationType | undefined>(undefined, Validators.required);
  public readonly titleControl = new FormControl<string | undefined>(undefined, Validators.required);
  public readonly formGroup = new FormGroup({
    type: this.typeControl,
    title: this.titleControl
  });

  public onContentChanged(event: string): void {
    this.details = event;
  }

  public displayNotification(): void {
    let detailsObject: unknown;
    if (this.details) {
      detailsObject = JSON.parse(this.details);
    }

    const title = this.titleControl.value;
    const type = this.typeControl.value;
    if (type && title) {
      this.store.dispatchAction(new DisplayNotificationAction(type, title, detailsObject));
    }
  }
}
