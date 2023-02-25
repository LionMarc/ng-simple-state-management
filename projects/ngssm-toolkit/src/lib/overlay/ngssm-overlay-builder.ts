import { Directionality } from '@angular/cdk/bidi';
import {
  ComponentType,
  Overlay,
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT, Location } from '@angular/common';
import {
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NgssmMessageOverlayComponent } from './ngssm-message-overlay.component';

@Injectable()
export class NgssmOverlayBuilder {
  private readonly _overlayMessage$ = new BehaviorSubject<string>('Please wait');

  private overlay: Overlay;
  private overlayRef: OverlayRef;

  public overLayTemplate: TemplateRef<any> | undefined;
  public overlayComponent: ComponentType<any> | undefined;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) document: any,
    scrollStrategies: ScrollStrategyOptions,
    // eslint-disable-next-line deprecation/deprecation
    componentFactoryResolver: ComponentFactoryResolver,
    positionBuilder: OverlayPositionBuilder,
    keyboardDispatcher: OverlayKeyboardDispatcher,
    injector: Injector,
    ngZone: NgZone,
    directionality: Directionality,
    location: Location,
    outsideClickDispatcher: OverlayOutsideClickDispatcher,
    renderer: Renderer2
  ) {
    renderer.setStyle(this.elementRef.nativeElement, 'position', 'relative');
    const container = {
      getContainerElement: () => this.elementRef.nativeElement
    };

    this.overlay = new Overlay(
      scrollStrategies,
      container as any,
      componentFactoryResolver,
      positionBuilder,
      keyboardDispatcher,
      injector,
      ngZone,
      document,
      directionality,
      location,
      outsideClickDispatcher
    );

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
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
