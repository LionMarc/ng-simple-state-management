import { Component, ChangeDetectionStrategy, ViewContainerRef, Type, inject, signal, input, effect } from '@angular/core';

@Component({
  selector: 'ngssm-wrapper',
  imports: [],
  templateUrl: './wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WrapperComponent {
  public readonly item = input<string | Type<unknown> | undefined>();

  public readonly innerHtml = signal<string | undefined>(undefined);

  private readonly viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const inputItem = this.item();
      if (typeof inputItem === 'string') {
        this.innerHtml.set(inputItem);
      } else if (inputItem) {
        this.viewContainerRef.clear();
        this.viewContainerRef.createComponent(inputItem);
      }
    });
  }
}
