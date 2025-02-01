import { ElementRef, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

@Injectable()
export class NgssmOverlay extends Overlay {
  constructor() {
    super();
  }

  public setContainerRef(elementRef: ElementRef) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._overlayContainer = {
      getContainerElement: () => elementRef.nativeElement
    };
  }
}
