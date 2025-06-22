import { Component, ChangeDetectionStrategy, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createSignal } from 'ngssm-store';

import { RemoteCall, RemoteCallStatus } from '../remote-call';
import { selectNgssmRemoteCallState } from '../ngssm-remote-call.state';

@Component({
  selector: 'ngssm-remote-call-error',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './ngssm-remote-call-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngssm-remote-call-error'
  }
})
export class NgssmRemoteCallErrorComponent {
  private readonly remoteCalls = createSignal((state) => selectNgssmRemoteCallState(state).remoteCalls);

  public readonly remoteCallId = input<string>('');

  public readonly errorContainerRendered = signal<boolean>(false);
  public readonly errorDescription = signal<string>('');

  constructor() {
    effect(() => {
      const id = this.remoteCallId();
      const remoteCall: RemoteCall = this.remoteCalls()[id];
      this.errorContainerRendered.set(remoteCall?.status === RemoteCallStatus.failed);
      const description: string =
        remoteCall?.status !== RemoteCallStatus.failed
          ? ''
          : remoteCall.message
            ? remoteCall.message
            : remoteCall.httpErrorResponse
              ? JSON.stringify(remoteCall.httpErrorResponse, null, 2)
              : 'No error description provided!';
      this.errorDescription.set(description);
    });
  }
}
