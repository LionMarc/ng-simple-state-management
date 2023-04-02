import { ComponentRef, Directive, Input, ViewContainerRef } from '@angular/core';

export interface NgssmComponentAction {
  (component: any): void;
}

@Directive({
  selector: '[ngssmComponentDisplay]',
  standalone: true
})
export class NgssmComponentDisplayDirective {
  private componentRef?: ComponentRef<any>;
  private componentAction?: NgssmComponentAction | null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  @Input() public set ngssmComponentDisplay(value: any) {
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
