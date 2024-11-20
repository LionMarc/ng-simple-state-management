import { Component, ChangeDetectionStrategy, Input, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, switchMap } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { selectNgssmRemoteCallState } from '../../state';
import { RemoteCallStatus } from '../../model';

@Component({
    selector: 'ngssm-remote-call-error',
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './ngssm-remote-call-error.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRemoteCallErrorComponent extends NgSsmComponent {
  private readonly _remoteCallId$ = new Subject<string>();

  public readonly errorContainerRendered = signal<boolean>(false);
  public readonly errorDescription = signal<string>('');

  @HostBinding('class') public hostCssClasses = 'ngssm-remote-call-error';

  constructor(store: Store) {
    super(store);

    this._remoteCallId$.pipe(switchMap((v) => this.watch((s) => selectNgssmRemoteCallState(s).remoteCalls[v]))).subscribe((remoteCall) => {
      this.errorContainerRendered.set(remoteCall?.status === RemoteCallStatus.ko);
      const description: string =
        remoteCall?.status !== RemoteCallStatus.ko
          ? ''
          : !!remoteCall.message
            ? remoteCall.message
            : !!remoteCall.error
              ? JSON.stringify(remoteCall.error, null, 2)
              : 'No error description provided!';
      this.errorDescription.set(description);
    });
  }

  @Input() public set remoteCallId(value: string) {
    this._remoteCallId$.next(value);
  }

  public hideComponent(): void {
    this.errorContainerRendered.set(false);
  }
}
