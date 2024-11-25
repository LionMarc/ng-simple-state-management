import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { selectShellState } from '../../state';
import { ShellNotificationComponent } from '../shell-notification/shell-notification.component';

@Component({
  selector: 'ngssm-shell-notification-popup',
  imports: [CommonModule, ShellNotificationComponent],
  templateUrl: './shell-notification-popup.component.html',
  styleUrls: ['./shell-notification-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellNotificationPopupComponent extends NgSsmComponent {
  private readonly _shellNotificationIndex$ = new BehaviorSubject<number>(-1);

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectShellState(s).shellNotifications.notifications).subscribe((notifications) => {
      const items = notifications ?? [];
      this._shellNotificationIndex$.next(items.length - 1);
    });
  }

  public get shellNotificationIndex$(): Observable<number> {
    return this._shellNotificationIndex$.asObservable();
  }
}
