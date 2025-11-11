import { Directive, inject, input, TemplateRef, effect } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { NgssmOverlayBuilder } from './ngssm-overlay-builder';

@Directive({
  selector: '[ngssmDisplayOverlay]',
  providers: [NgssmOverlayBuilder]
})
export class NgssmComponentOverlayDirective {
  public readonly overlayTemplate = input<TemplateRef<unknown> | undefined | null>();
  public readonly overlayComponent = input<ComponentType<unknown> | undefined | null>();
  public readonly overlayMessage = input<string | null | undefined>('Please wait');
  public readonly ngssmDisplayOverlay = input<boolean>(false);

  private overlayBuilder = inject(NgssmOverlayBuilder);

  constructor() {
    effect(() => {
      this.overlayBuilder.overlayTemplate = this.overlayTemplate() ?? undefined;
      this.overlayBuilder.overlayComponent = this.overlayComponent() ?? undefined;
      this.overlayBuilder.overlayMessage.set(this.overlayMessage() ?? '');
    });

    effect(() => {
      const doRenderOveralay = this.ngssmDisplayOverlay();
      if (doRenderOveralay === true) {
        this.overlayBuilder.showOverlay();
      } else {
        this.overlayBuilder.hideOverlay();
      }
    });
  }
}
