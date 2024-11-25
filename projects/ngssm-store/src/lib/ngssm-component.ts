import { Directive, OnDestroy } from '@angular/core';
import { map, Observable, Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { Action } from './action';
import { State } from './state';
import { Store } from './store';

@Directive({
  standalone: false
})
export class NgSsmComponent implements OnDestroy {
  private readonly _unsubscribeAll$ = new Subject<void>();

  constructor(protected store: Store) {}

  protected get unsubscribeAll$(): Observable<void> {
    return this._unsubscribeAll$.asObservable();
  }

  public ngOnDestroy(): void {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  public watch<T>(selector: (state: State) => T): Observable<T> {
    return this.store.state$.pipe(
      map((state) => selector(state)),
      distinctUntilChanged(),
      takeUntil(this.unsubscribeAll$)
    );
  }

  public dispatchAction(action: Action): void {
    this.store.dispatchAction(action);
  }

  public dispatchActionType(actionType: string): void {
    this.store.dispatchActionType(actionType);
  }
}
