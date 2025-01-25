import { Directive, inject, Input, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { NgssmOverlayBuilder } from './ngssm-overlay-builder';
import { NgssmOverlay } from './ngssm-overlay';

@Directive({
  selector: '[ngssmDisplayOverlay]',
  providers: [NgssmOverlayBuilder, NgssmOverlay]
})
export class NgssmComponentOverlayDirective {
  private overlayBuilder = inject(NgssmOverlayBuilder);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('overlayTemplate') set overLayTemplate(value: TemplateRef<unknown> | undefined) {
    this.overlayBuilder.overLayTemplate = value;
  }

  @Input() set overlayComponent(value: ComponentType<unknown> | undefined) {
    this.overlayBuilder.overlayComponent = value;
  }

  @Input() public set overlayMessage(value: string) {
    this.overlayBuilder.overlayMessage = value;
  }

  @Input('ngssmDisplayOverlay') public set displayOverlay(value: boolean) {
    if (value === true) {
      this.overlayBuilder.showOverlay();
    } else {
      this.overlayBuilder.hideOverlay();
    }
  }
}
