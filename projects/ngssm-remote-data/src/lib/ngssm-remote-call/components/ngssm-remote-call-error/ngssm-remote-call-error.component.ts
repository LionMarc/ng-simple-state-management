import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { selectNgssmRemoteCallState } from '../../state';
import { RemoteCallError } from '../../model';

@Component({
  selector: 'ngssm-remote-call-error',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './ngssm-remote-call-error.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRemoteCallErrorComponent extends NgSsmComponent {
  private readonly _remoteCallId$ = new Subject<string>();
  private readonly _remoteCallError$ = new BehaviorSubject<RemoteCallError | undefined>(undefined);

  @HostBinding('class') public hostCssClasses = 'ngssm-remote-call-error';

  constructor(store: Store) {
    super(store);

    this._remoteCallId$
      .pipe(switchMap((v) => this.watch((s) => selectNgssmRemoteCallState(s).remoteCalls[v])))
      .subscribe((remoteCall) => this._remoteCallError$.next(remoteCall?.error));
  }

  @Input() public set remoteCallId(value: string) {
    this._remoteCallId$.next(value);
  }

  public get remoteCallError$(): Observable<RemoteCallError | undefined> {
    return this._remoteCallError$.asObservable();
  }

  public hideComponent(): void {
    this._remoteCallError$.next(undefined);
  }
}
