import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmOverlayBuilder } from 'ngssm-toolkit';

import { RemoteCallStatus } from '../model';
import { selectRemoteCall } from '../state';

@Directive({
  selector: '[ngssmRemoteCall]',
  standalone: true,
  providers: [NgssmOverlayBuilder]
})
export class NgssmRemoteCallDirective extends NgSsmComponent {
  private subscription: Subscription | undefined;

  constructor(store: Store, private overlyBuilder: NgssmOverlayBuilder) {
    super(store);
    this.unsubscribeAll$.subscribe(() => this.overlyBuilder.hideOverlay());
  }

  @Input('ngssmRemoteCall') set remoteCallId(value: string) {
    this.subscription?.unsubscribe();
    this.subscription = this.watch((s) => selectRemoteCall(s, value)).subscribe((value) => {
      if (value.status === RemoteCallStatus.inProgress) {
        this.overlyBuilder.showOverlay();
      } else {
        this.overlyBuilder.hideOverlay();
      }
    });
  }
}
