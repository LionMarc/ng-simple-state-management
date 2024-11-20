import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent extends NgSsmComponent {
  private readonly _shellConfig$ = new BehaviorSubject<ShellConfig | undefined>(undefined);
  private readonly _navigationBarOpen$ = new BehaviorSubject<boolean>(true);

  @HostBinding('class') class = 'ngssm-shell';

  constructor(store: Store) {
    super(store);

    combineLatest([
      this.watch((s) => selectShellState(s).navigationBarOpen),
      this.watch((s) => selectShellState(s).navigationBarLockStatus)
    ]).subscribe((values) => {
      let isOpen = false;

      switch (values[1]) {
        case LockStatus.lockedClosed:
          isOpen = false;
          break;

        case LockStatus.lockedOpen:
          isOpen = true;
          break;

        default:
          isOpen = values[0];
          break;
      }

      this._navigationBarOpen$.next(isOpen);
    });
  }

  @Input() public set shellConfig(value: ShellConfig) {
    this._shellConfig$.next(value);
  }

  public get navigationBarOpen$(): Observable<boolean> {
    return this._navigationBarOpen$.asObservable();
  }

  public get shellConfig$(): Observable<ShellConfig | undefined> {
    return this._shellConfig$.asObservable();
  }

  public get notificationsCount$(): Observable<number> {
    return this.watch((s) => selectShellState(s).shellNotifications.notifications.length);
  }

  public toggleNavigationBarState(): void {
    this.dispatchActionType(ShellActionType.toggleNavigationBarState);
  }
}
