import { Directive, HostListener, Input } from '@angular/core';

import { Store } from 'ngssm-store';

import { ToggleElementVisibilityAction } from '../actions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[toggleElementVisibility]',
  standalone: true
})
export class ToggleElementVisibilityDirective {
  @Input('toggleElementVisibility') public key: string | undefined | null = '';

  constructor(private store: Store) {}

  @HostListener('click', ['$event'])
  public toggleElementvisibility(): void {
    const elementKey = this.key;
    if (elementKey) {
      this.store.dispatchAction(new ToggleElementVisibilityAction(elementKey));
    }
  }
}
