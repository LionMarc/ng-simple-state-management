import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { createSignal, Store } from 'ngssm-store';

import { ShellNotification, ShellNotificationType } from '../../model';
import { selectShellState } from '../../state';
import { DisplayNotificationDetailsAction } from '../../actions';

@Component({
  selector: 'ngssm-shell-notification',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './shell-notification.component.html',
  styleUrls: ['./shell-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellNotificationComponent {
  public readonly displayDetailsButton = input(false);
  public readonly shellNotificationIndex = input<number>();

  public readonly shellNotification = computed<ShellNotification | undefined>(() => {
    return this.notifications()[this.shellNotificationIndex() ?? -1];
  });

  public readonly shellNotificationType = ShellNotificationType;

  private readonly store = inject(Store);
  private readonly notifications = createSignal((state) => selectShellState(state).shellNotifications.notifications);

  public displayDetails(): void {
    this.store.dispatchAction(new DisplayNotificationDetailsAction(this.shellNotificationIndex() ?? -1));
  }
}
