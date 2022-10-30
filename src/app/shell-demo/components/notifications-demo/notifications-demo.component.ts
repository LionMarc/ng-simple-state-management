import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgssmAceEditorMode } from 'ngssm-ace-editor';
import { DisplayNotificationAction, ShellNotificationType } from 'ngssm-shell';
import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-notifications-demo',
  templateUrl: './notifications-demo.component.html',
  styleUrls: ['./notifications-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsDemoComponent extends NgSsmComponent {
  private details: string | undefined;

  public readonly ngssmAceEditorMode = NgssmAceEditorMode;
  public readonly notificationTypes = [ShellNotificationType.success, ShellNotificationType.error];
  public readonly typeControl = new FormControl<ShellNotificationType | undefined>(undefined, Validators.required);
  public readonly titleControl = new FormControl<string | undefined>(undefined, Validators.required);
  public readonly formGroup = new FormGroup({
    type: this.typeControl,
    title: this.titleControl
  });

  constructor(store: Store) {
    super(store);
  }

  public onContentChanged(event: string): void {
    this.details = event;
  }

  public displayNotification(): void {
    let detailsObject: any;
    if (this.details) {
      detailsObject = JSON.parse(this.details);
    }

    this.dispatchAction(new DisplayNotificationAction(this.typeControl.value as any, this.titleControl.value as any, detailsObject));
  }
}
