import { ElementRef, Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class NgssmOverlayContainer extends OverlayContainer {
  private elementRef: ElementRef | undefined;

  public setContainerRef(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  public override getContainerElement(): HTMLElement {
    return this.elementRef?.nativeElement;
  }
}
