import { Directive, inject, Input, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

import { NgssmOverlayBuilder } from './ngssm-overlay-builder';
import { NgssmOverlayContainer } from './ngssm-overlay-container';

import { OverlayContainer } from '@angular/cdk/overlay';

@Directive({
  selector: '[ngssmDisplayOverlay]',
  providers: [NgssmOverlayBuilder, { provide: OverlayContainer, useClass: NgssmOverlayContainer }]
})
export class NgssmComponentOverlayDirective {
  private overlayBuilder = inject(NgssmOverlayBuilder);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('overlayTemplate') set overLayTemplate(value: TemplateRef<unknown> | undefined | null) {
    this.overlayBuilder.overLayTemplate = value ?? undefined;
  }

  @Input() set overlayComponent(value: ComponentType<unknown> | undefined | null) {
    this.overlayBuilder.overlayComponent = value ?? undefined;
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
