import { Directive, inject, OnDestroy } from '@angular/core';
import { map, Observable, Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { Action } from './action';
import { State } from './state';
import { Store } from './store';

@Directive({})
export class NgSsmComponent implements OnDestroy {
  protected store = inject(Store);

  private readonly _unsubscribeAll$ = new Subject<void>();

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
