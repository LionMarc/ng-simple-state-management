import { ComponentType, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, OnDestroy, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NgssmMessageOverlayComponent } from './ngssm-message-overlay.component';
import { NgssmOverlay } from './ngssm-overlay';

@Injectable()
export class NgssmOverlayBuilder implements OnDestroy {
  private readonly _overlayMessage$ = new BehaviorSubject<string>('Please wait');

  private overlayRef: OverlayRef;

  public overLayTemplate: TemplateRef<any> | undefined;
  public overlayComponent: ComponentType<any> | undefined;

  constructor(
    private elementRef: ElementRef,
    private ngssmOverlay: NgssmOverlay,
    private viewContainerRef: ViewContainerRef,
    renderer: Renderer2
  ) {
    renderer.setStyle(this.elementRef.nativeElement, 'position', 'relative');
    this.ngssmOverlay.setContainerRef(this.elementRef);

    this.overlayRef = this.ngssmOverlay.create({
      positionStrategy: this.ngssmOverlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
  }

  public ngOnDestroy(): void {
    this.overlayRef.detach();
  }

  public set overlayMessage(value: string) {
    this._overlayMessage$.next(value);
  }

  public showOverlay(): void {
    if (this.overLayTemplate) {
      this.overlayRef.attach(new TemplatePortal(this.overLayTemplate, this.viewContainerRef));
    } else if (this.overlayComponent) {
      const ref = this.overlayRef.attach(new ComponentPortal(this.overlayComponent));
      if (this.overlayComponent === NgssmMessageOverlayComponent) {
        ref.instance.message$ = this._overlayMessage$.asObservable();
      }
    } else {
      const ref = this.overlayRef.attach(new ComponentPortal(NgssmMessageOverlayComponent));
      ref.instance.message$ = this._overlayMessage$.asObservable();
    }
  }

  public hideOverlay(): void {
    this.overlayRef.detach();
  }
}
