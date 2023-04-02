import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngssmComponentDisplay]',
  standalone: true
})
export class NgssmComponentDisplayDirective {
  constructor(private viewContainerRef: ViewContainerRef) {}

  @Input() public set ngssmComponentDisplay(value: any) {
    this.viewContainerRef.clear();
    if (value) {
      this.viewContainerRef.createComponent(value);
    }
  }
}
