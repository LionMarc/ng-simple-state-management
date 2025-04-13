import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { createSignal } from 'ngssm-store';

import { selectShellState } from '../../state';
import { ShellNotificationComponent } from '../shell-notification/shell-notification.component';

@Component({
  selector: 'ngssm-shell-notification-popup',
  imports: [CommonModule, ShellNotificationComponent],
  templateUrl: './shell-notification-popup.component.html',
  styleUrls: ['./shell-notification-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellNotificationPopupComponent {
  public readonly shellNotificationIndex = createSignal((state) => {
    const items = selectShellState(state).shellNotifications.notifications;
    return items.length - 1;
  });
}
