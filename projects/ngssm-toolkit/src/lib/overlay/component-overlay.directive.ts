import {
  Overlay,
  OverlayKeyboardDispatcher,
  OverlayOutsideClickDispatcher,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Location } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { MessageOverlayComponent } from './message-overlay.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[displayOverlay]'
})
export class ComponentOverlayDirective implements OnDestroy, AfterViewInit {
  private readonly unSubscribeAll$ = new Subject<void>();
  private readonly _displayOverlay$ = new BehaviorSubject<boolean>(false);
  private readonly _overlayMessage$ = new BehaviorSubject<string>('Please wait');

  private overlay: Overlay;
  private overlayRef: OverlayRef;

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

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('overlayTemplate') overLayTemplate: TemplateRef<any> | undefined;

  @Input() overlayComponent: ComponentType<any> | undefined;

  @Input() public set overlayMessage(value: string) {
    this._overlayMessage$.next(value);
  }

  @Input('displayOverlay') public set dispalyOverlay(value: boolean) {
    this._displayOverlay$.next(value);
  }

  public ngAfterViewInit(): void {
    this._displayOverlay$.pipe(takeUntil(this.unSubscribeAll$)).subscribe((v) => {
      if (v) {
        this.showOverlay();
      } else {
        this.hideOverlay();
      }
    });
  }

  public ngOnDestroy(): void {
    this.unSubscribeAll$.next();
    this.unSubscribeAll$.complete();
    if (this._displayOverlay$.getValue()) {
      this.overlayRef.detach();
    }
  }

  private showOverlay(): void {
    if (this.overLayTemplate) {
      this.overlayRef.attach(new TemplatePortal(this.overLayTemplate, this.viewContainerRef));
    } else if (this.overlayComponent) {
      const ref = this.overlayRef.attach(new ComponentPortal(this.overlayComponent));
      if (this.overlayComponent === MessageOverlayComponent) {
        ref.instance.message$ = this._overlayMessage$.asObservable();
      }
    } else {
      const ref = this.overlayRef.attach(new ComponentPortal(MessageOverlayComponent));
      ref.instance.message$ = this._overlayMessage$.asObservable();
    }
  }

  private hideOverlay(): void {
    this.overlayRef.detach();
  }
}
