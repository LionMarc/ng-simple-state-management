import { ElementRef, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

@Injectable()
export class NgssmOverlay extends Overlay {
  constructor() {
    super();
  }

  public setContainerRef(elementRef: ElementRef) {
    (this as any)._overlayContainer = {
      getContainerElement: () => elementRef.nativeElement
    };
  }
}
