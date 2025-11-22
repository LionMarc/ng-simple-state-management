import { Directive, inject, input } from '@angular/core';

import { Store } from 'ngssm-store';

import { ToggleElementVisibilityAction } from '../actions';

@Directive({
  selector: '[ngssmToggleElementVisibility]',
  host: {
    '(click)': 'toggleElementVisibility()'
  }
})
export class NgssmToggleElementVisibility {
  public readonly ngssmToggleElementVisibility = input<string | undefined | null>(undefined);

  private readonly store = inject(Store);

  public toggleElementVisibility(): void {
    const elementKey = this.ngssmToggleElementVisibility();
    if (elementKey) {
      this.store.dispatchAction(new ToggleElementVisibilityAction(elementKey));
    }
  }
}
