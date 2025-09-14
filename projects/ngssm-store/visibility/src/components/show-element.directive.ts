import { Directive, HostListener, inject, Input } from '@angular/core';
import { Store } from 'ngssm-store';
import { ShowElementAction } from '../actions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[showElement]'
})
export class ShowElementDirective {
  private readonly store = inject(Store);

  @Input('showElement') public key: string | undefined | null = '';

  @HostListener('click', ['$event'])
  public toggleElementvisibility(): void {
    const elementKey = this.key;
    if (elementKey) {
      this.store.dispatchAction(new ShowElementAction(elementKey));
    }
  }
}
