import { Directive, effect, inject, input } from '@angular/core';

import { createSignal } from 'ngssm-store';
import { NgssmOverlayBuilder, NgssmOverlayContainer } from 'ngssm-toolkit';

import { DataStatus } from '../model';
import { selectRemoteDataState } from '../state';
import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({
  selector: '[ngssmRemoteDataOverlay]',
  standalone: true,
  providers: [NgssmOverlayBuilder, { provide: OverlayContainer, useClass: NgssmOverlayContainer }]
})
export class NgssmRemoteDataOverlayDirective {
  private readonly overlyBuilder = inject(NgssmOverlayBuilder);
  private readonly remoteDataState = createSignal((state) => selectRemoteDataState(state));

  private isDisplayed = false;

  public readonly keys = input.required<string[]>({
    alias: 'ngssmRemoteDataOverlay'
  });

  constructor() {
    effect(() => {
      const remoteDataKeys = this.keys();
      const state = this.remoteDataState();
      if (remoteDataKeys.findIndex((r) => state[r]?.status === DataStatus.loading) !== -1) {
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
