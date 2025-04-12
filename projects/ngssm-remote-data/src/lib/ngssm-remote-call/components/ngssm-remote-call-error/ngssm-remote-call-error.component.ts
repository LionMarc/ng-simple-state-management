import { Component, ChangeDetectionStrategy, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createSignal } from 'ngssm-store';

import { selectNgssmRemoteCallState } from '../../state';
import { RemoteCallStatus } from '../../model';

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
      const remoteCall = this.remoteCalls()[id];
      this.errorContainerRendered.set(remoteCall?.status === RemoteCallStatus.ko);
      const description: string =
        remoteCall?.status !== RemoteCallStatus.ko
          ? ''
          : remoteCall.message
            ? remoteCall.message
            : remoteCall.error
              ? JSON.stringify(remoteCall.error, null, 2)
              : 'No error description provided!';
      this.errorDescription.set(description);
    });
  }
}
