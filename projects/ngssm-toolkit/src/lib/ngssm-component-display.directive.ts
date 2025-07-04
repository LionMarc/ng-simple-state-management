import { ComponentRef, Directive, inject, Input, Type, ViewContainerRef } from '@angular/core';

export type NgssmComponentAction = (component: unknown) => void;

@Directive({
  selector: '[ngssmComponentDisplay]',
  standalone: true
})
export class NgssmComponentDisplayDirective {
  private readonly viewContainerRef = inject(ViewContainerRef);

  private componentRef?: ComponentRef<unknown>;
  private componentAction?: NgssmComponentAction | null;

  @Input() public set ngssmComponentDisplay(value: Type<unknown> | null | undefined) {
    this.componentRef = undefined;
    this.viewContainerRef.clear();
    if (value) {
      this.componentRef = this.viewContainerRef.createComponent(value);
      if (this.componentRef && this.componentAction) {
        this.componentAction(this.componentRef.instance);
      }
    }
  }

  @Input() public set ngssmComponentAction(value: NgssmComponentAction | null | undefined) {
    this.componentAction = value;
    if (this.componentRef && this.componentAction) {
      this.componentAction(this.componentRef.instance);
    }
  }
}
