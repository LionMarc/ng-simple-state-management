import { Directive, inject, input } from '@angular/core';

import { Store } from 'ngssm-store';

import { ShowElementAction } from '../actions';

@Directive({
  selector: '[ngssmShowElement]',
  host: {
    '(click)': 'showElement()'
  }
})
export class NgssmShowElement {
  public readonly ngssmShowElement = input<string | undefined | null>(undefined);

  private readonly store = inject(Store);

  public showElement(): void {
    const elementKey = this.ngssmShowElement();
    if (elementKey) {
      this.store.dispatchAction(new ShowElementAction(elementKey));
    }
  }
}
