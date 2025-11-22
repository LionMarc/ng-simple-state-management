import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createSignal, Store } from 'ngssm-store';
import { NgssmAceEditorComponent, NgssmAceEditorMode } from 'ngssm-ace-editor';

import { selectShellState } from '../../state';
import { ShellNotificationType } from '../../model';
import { DisplayNotificationDetailsAction, ShellActionType } from '../../actions';
import { ShellNotificationComponent } from '../shell-notification/shell-notification.component';

@Component({
  selector: 'ngssm-shell-notifications',
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgssmAceEditorComponent, ShellNotificationComponent],
  templateUrl: './shell-notifications.component.html',
  styleUrls: ['./shell-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellNotificationsComponent {
  private readonly store = inject(Store);
  private readonly selectedNotificaitonIndex = createSignal(
    (state) => selectShellState(state).shellNotifications.selectedNotificaitonIndex
  );

  public readonly notificationSelected = signal<boolean>(false);
  public readonly notifications = createSignal((state) => selectShellState(state).shellNotifications.notifications);
  public readonly details = signal<string>('');

  public readonly shellNotificationType = ShellNotificationType;
  public readonly ngssmAceEditorMode = NgssmAceEditorMode;

  constructor() {
    effect(() => {
      const items = this.notifications();
      const index = this.selectedNotificaitonIndex();
      const id = index ?? -1;
      this.notificationSelected.set(id !== -1);
      const details = items[id]?.details;
      if (details) {
        this.details.set(JSON.stringify(details, null, 2));
      } else {
        this.details.set('');
      }
    });
  }

  public closeDetailsPanel(): void {
    this.store.dispatchAction(new DisplayNotificationDetailsAction(undefined));
  }

  public clearAll(): void {
    this.store.dispatchActionType(ShellActionType.clearAllNotifications);
  }
}
