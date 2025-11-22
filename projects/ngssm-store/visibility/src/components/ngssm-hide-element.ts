import { Directive, inject, input } from '@angular/core';

import { Store } from 'ngssm-store';

import { HideElementAction } from '../actions';

@Directive({
  selector: '[ngssmHideElement]',
  host: {
    '(click)': 'hideElement()'
  }
})
export class NgssmHideElement {
  public readonly ngssmHideElement = input<string | undefined | null>(undefined);

  private readonly store = inject(Store);

  public hideElement(): void {
    const elementKey = this.ngssmHideElement();
    if (elementKey) {
      this.store.dispatchAction(new HideElementAction(elementKey));
    }
  }
}
