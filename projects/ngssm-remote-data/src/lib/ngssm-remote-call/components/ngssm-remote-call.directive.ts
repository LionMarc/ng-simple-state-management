import { Directive, effect, inject, input } from '@angular/core';

import { createSignal } from 'ngssm-store';
import { NgssmOverlayBuilder, NgssmOverlayContainer } from 'ngssm-toolkit';

import { RemoteCallStatus } from '../model';
import { selectNgssmRemoteCallState } from '../state';
import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({
  selector: '[ngssmRemoteCall]',
  standalone: true,
  providers: [NgssmOverlayBuilder, { provide: OverlayContainer, useClass: NgssmOverlayContainer }]
})
export class NgssmRemoteCallDirective {
  private readonly overlyBuilder = inject(NgssmOverlayBuilder);
  private readonly remoteCalls = createSignal((state) => selectNgssmRemoteCallState(state).remoteCalls);

  public readonly ngssmRemoteCall = input.required<string>();

  constructor() {
    effect(() => {
      const id = this.ngssmRemoteCall();
      const remoteCall = this.remoteCalls()[id];
      if (remoteCall?.status === RemoteCallStatus.inProgress) {
        this.overlyBuilder.showOverlay();
      } else {
        this.overlyBuilder.hideOverlay();
      }
    });
  }
}
