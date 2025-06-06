import {
  ComponentType,
  createOverlayRef,
  createRepositionScrollStrategy,
  Overlay,
  OverlayContainer,
  OverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  DestroyableInjector,
  ElementRef,
  inject,
  Injectable,
  Injector,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Logger } from 'ngssm-store';

import { NgssmMessageOverlayComponent } from './ngssm-message-overlay.component';
import { NgssmOverlayContainer } from './ngssm-overlay-container';

@Injectable()
export class NgssmOverlayBuilder implements OnDestroy {
  private static nextId = 1;

  private readonly logger = inject(Logger);
  private readonly injector = inject(Injector);
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  private readonly overlayInjector?: DestroyableInjector;
  private readonly _overlayMessage$ = new BehaviorSubject<string>('Please wait');
  private id = NgssmOverlayBuilder.nextId++;

  private overlayRef: OverlayRef;

  public overLayTemplate: TemplateRef<unknown> | undefined;
  public overlayComponent: ComponentType<unknown> | undefined;

  constructor() {
    this.logger.information(`[NgssmOverlayBuilder] Creating overlay ${this.id}`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'relative');

    this.overlayInjector = Injector.create({
      providers: [{ provide: OverlayContainer, useClass: NgssmOverlayContainer }],
      parent: this.injector
    });
    const overlayContainer = this.overlayInjector.get(OverlayContainer);
    (overlayContainer as NgssmOverlayContainer).setContainerRef(this.elementRef);

    this.overlayRef = createOverlayRef(this.overlayInjector, {
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: createRepositionScrollStrategy(this.injector),
      hasBackdrop: true
    });
  }

  public ngOnDestroy(): void {
    this.logger.information(`[NgssmOverlayBuilder] Destroying overlay ${this.id}`);
    this.overlayRef.detach();
    this.overlayInjector?.destroy();
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
        (ref.instance as NgssmMessageOverlayComponent).message$ = this._overlayMessage$.asObservable();
      }
    } else {
      const ref = this.overlayRef.attach(new ComponentPortal(NgssmMessageOverlayComponent, this.viewContainerRef));
      ref.instance.message$ = this._overlayMessage$.asObservable();
    }
  }

  public hideOverlay(): void {
    this.overlayRef.detach();
  }
}
