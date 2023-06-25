import { Directive, HostListener, Input } from '@angular/core';
import { Store } from 'ngssm-store';
import { ShowElementAction } from '../actions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[showElement]',
  standalone: true
})
export class ShowElementDirective {
  @Input('showElement') public key: string | undefined | null = '';

  constructor(private store: Store) {}

  @HostListener('click', ['$event'])
  public toggleElementvisibility(): void {
    const elementKey = this.key;
    if (elementKey) {
      this.store.dispatchAction(new ShowElementAction(elementKey));
    }
  }
}
