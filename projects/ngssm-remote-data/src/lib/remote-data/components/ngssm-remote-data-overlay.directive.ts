import { Directive, Input } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmOverlayBuilder } from 'ngssm-toolkit';

import { DataStatus } from '../model';
import { selectRemoteData } from '../state';

@Directive({
  selector: '[ngssmRemoteDataOverlay]',
  standalone: true,
  providers: [NgssmOverlayBuilder]
})
export class NgssmRemoteDataOverlayDirective extends NgSsmComponent {
  private subscription: Subscription | undefined;
  private isDisplayed = false;

  constructor(store: Store, private overlyBuilder: NgssmOverlayBuilder) {
    super(store);
    this.unsubscribeAll$.subscribe(() => this.overlyBuilder.hideOverlay());
  }

  @Input() set ngssmRemoteDataOverlay(values: string[]) {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
    if (values.length > 0) {
      this.subscription = combineLatest(values.map((v) => this.watch((s) => selectRemoteData(s, v)))).subscribe((v) => {
        if (v.map((w) => w?.status).includes(DataStatus.loading)) {
          if (!this.isDisplayed) {
            this.overlyBuilder.showOverlay();
            this.isDisplayed = true;
          }
        } else {
          if (this.isDisplayed) {
            this.overlyBuilder.hideOverlay();
            this.isDisplayed = false;
          }
        }
      });
    }
  }
}
