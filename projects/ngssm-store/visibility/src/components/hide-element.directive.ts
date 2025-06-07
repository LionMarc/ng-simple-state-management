import { Directive, HostListener, inject, Input } from '@angular/core';
import { Store } from 'ngssm-store';
import { HideElementAction } from '../actions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hideElement]',
  standalone: true
})
export class HideElementDirective {
  private readonly store = inject(Store);

  @Input('hideElement') public key: string | undefined | null = '';

  @HostListener('click', ['$event'])
  public toggleElementvisibility(): void {
    const elementKey = this.key;
    if (elementKey) {
      this.store.dispatchAction(new HideElementAction(elementKey));
    }
  }
}
