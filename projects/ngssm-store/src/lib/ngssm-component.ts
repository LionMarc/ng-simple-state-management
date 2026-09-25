import { Directive, inject, Injector, OnDestroy } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, Subject, distinctUntilChanged, takeUntil } from 'rxjs';

import { Action } from './action';
import { State } from './state';
import { Store } from './store';

@Directive({})
export class NgSsmComponent implements OnDestroy {
  protected store = inject(Store);
  private readonly injector = inject(Injector);

  private readonly _unsubscribeAll$ = new Subject<void>();

  protected get unsubscribeAll$(): Observable<void> {
    return this._unsubscribeAll$.asObservable();
  }

  public ngOnDestroy(): void {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  public watch<T>(selector: (state: State) => T): Observable<T> {
    return toObservable(this.store.state, { injector: this.injector }).pipe(
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
