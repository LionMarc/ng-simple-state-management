import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

import { createSignal, Store } from 'ngssm-store';

import { LockStatus, ShellConfig } from '../../model';
import { selectShellState } from '../../state';
import { ShellActionType } from '../../actions';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { ShellNotificationsComponent } from '../shell-notifications/shell-notifications.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'ngssm-shell',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    SideNavComponent,
    ShellNotificationsComponent,
    WrapperComponent
  ],
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngssm-shell'
  }
})
export class ShellComponent {
  private readonly store = inject(Store);
  private readonly navigationBarOpen = createSignal((state) => selectShellState(state).navigationBarOpen);
  private readonly navigationBarLockStatus = createSignal((state) => selectShellState(state).navigationBarLockStatus);

  public readonly shellConfig = input<ShellConfig>();

  public readonly notificationsCount = createSignal((state) => selectShellState(state).shellNotifications.notifications.length);
  public readonly navigationBarRendered = computed(() => {
    let isOpen: boolean;

    switch (this.navigationBarLockStatus()) {
      case LockStatus.lockedClosed:
        isOpen = false;
        break;

      case LockStatus.lockedOpen:
        isOpen = true;
        break;

      default:
        isOpen = this.navigationBarOpen();
        break;
    }

    return isOpen;
  });

  public toggleNavigationBarState(): void {
    this.store.dispatchActionType(ShellActionType.toggleNavigationBarState);
  }
}
