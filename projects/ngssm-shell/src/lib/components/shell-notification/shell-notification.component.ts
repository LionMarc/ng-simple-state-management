import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, combineLatest, Observable, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

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
export class ShellNotificationComponent extends NgSsmComponent {
  private readonly _displayDetailsButton$ = new BehaviorSubject<boolean>(false);
  private readonly _shellNotification$ = new BehaviorSubject<ShellNotification | undefined>(undefined);
  private readonly _shellNotificationIndex$ = new BehaviorSubject<number | null>(null);

  public readonly shellNotificationType = ShellNotificationType;

  constructor(store: Store) {
    super(store);

    combineLatest([this._shellNotificationIndex$, this.watch((s) => selectShellState(s).shellNotifications.notifications)])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((values) => {
        this._shellNotification$.next((values[1] ?? [])[values[0] ?? -1]);
      });
  }

  @Input() public set displayDetailsButton(value: boolean) {
    this._displayDetailsButton$.next(value);
  }

  @Input() public set shellNotificationIndex(value: number | null) {
    this._shellNotificationIndex$.next(value);
  }

  public get shellNotification$(): Observable<ShellNotification | undefined> {
    return this._shellNotification$.asObservable();
  }

  public get displayDetailsButton$(): Observable<boolean> {
    return this._displayDetailsButton$.asObservable();
  }

  public displayDetails(): void {
    this.dispatchAction(new DisplayNotificationDetailsAction(this._shellNotificationIndex$.value ?? -1));
  }
}
