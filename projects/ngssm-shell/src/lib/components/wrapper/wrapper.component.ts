import { Component, ChangeDetectionStrategy, Input, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
    selector: 'ngssm-wrapper',
    imports: [CommonModule],
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WrapperComponent extends NgSsmComponent {
  private readonly _innerHtml$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    store: Store,
    private viewContainerRef: ViewContainerRef
  ) {
    super(store);
  }

  @Input() public set item(value: any) {
    if (typeof value === 'string') {
      this._innerHtml$.next(value);
    } else if (!!value) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createComponent(value);
    }
  }

  public get innerHtml$(): Observable<string | undefined> {
    return this._innerHtml$.asObservable();
  }
}
