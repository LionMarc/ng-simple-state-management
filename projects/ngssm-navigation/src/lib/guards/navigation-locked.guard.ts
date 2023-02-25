import { inject, Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';

import { Store } from 'ngssm-store';

import { selectNavigationState } from '../state';

@Injectable({
  providedIn: 'root'
})
export class NavigationLockedGuard {
  constructor(private store: Store) {}

  public canDeactivate(): Observable<boolean> {
    return this.store.state$.pipe(
      take(1),
      map((s) => !selectNavigationState(s).navigationLocked)
    );
  }
}

export const isNavigationLocked = (store = inject(Store)): Observable<boolean> =>
  store.state$.pipe(
    take(1),
    map((s) => selectNavigationState(s).navigationLocked)
  );

export const isNavigationUnLocked = (store = inject(Store)): Observable<boolean> =>
  store.state$.pipe(
    take(1),
    map((s) => !selectNavigationState(s).navigationLocked)
  );
