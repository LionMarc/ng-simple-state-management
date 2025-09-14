import { Directive, HostListener, inject, Input } from '@angular/core';

import { Store } from 'ngssm-store';

import { ToggleElementVisibilityAction } from '../actions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[toggleElementVisibility]'
})
export class ToggleElementVisibilityDirective {
  private readonly store = inject(Store);

  @Input('toggleElementVisibility') public key: string | undefined | null = '';

  @HostListener('click', ['$event'])
  public toggleElementvisibility(): void {
    const elementKey = this.key;
    if (elementKey) {
      this.store.dispatchAction(new ToggleElementVisibilityAction(elementKey));
    }
  }
}
