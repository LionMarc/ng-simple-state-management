import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmAceEditorComponent, NgssmAceEditorMode } from 'ngssm-ace-editor';

import { selectShellState } from '../../state';
import { ShellNotification, ShellNotificationType } from '../../model';
import { DisplayNotificationDetailsAction, ShellActionType } from '../../actions';
import { ShellNotificationComponent } from '../shell-notification/shell-notification.component';

@Component({
  selector: 'ngssm-shell-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, NgssmAceEditorComponent, ShellNotificationComponent],
  templateUrl: './shell-notifications.component.html',
  styleUrls: ['./shell-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellNotificationsComponent extends NgSsmComponent {
  private readonly _notificationSelected$ = new BehaviorSubject<boolean>(false);
  private readonly _notifications$ = new BehaviorSubject<ShellNotification[]>([]);
  private readonly _details$ = new BehaviorSubject<string>('');

  public readonly shellNotificationType = ShellNotificationType;
  public readonly ngssmAceEditorMode = NgssmAceEditorMode;

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectShellState(s).shellNotifications.notifications).subscribe((values) => this._notifications$.next(values ?? []));

    combineLatest([
      this.watch((s) => selectShellState(s).shellNotifications.notifications),
      this.watch((s) => selectShellState(s).shellNotifications.selectedNotificaitonIndex)
    ]).subscribe((values) => {
      const id = values[1] ?? -1;
      this._notificationSelected$.next(id !== -1);
      const details = (values[0] ?? [])[id]?.details;
      if (details) {
        this._details$.next(JSON.stringify(details, null, 2));
      } else {
        this._details$.next('');
      }
    });
  }

  public get notificationSelected$(): Observable<boolean> {
    return this._notificationSelected$.asObservable();
  }

  public get notifications$(): Observable<ShellNotification[]> {
    return this._notifications$.asObservable();
  }

  public get details$(): Observable<string> {
    return this._details$.asObservable();
  }

  public closeDetailsPanel(): void {
    this.dispatchAction(new DisplayNotificationDetailsAction(undefined));
  }

  public clearAll(): void {
    this.dispatchActionType(ShellActionType.clearAllNotifications);
  }
}
