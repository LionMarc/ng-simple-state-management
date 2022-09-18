import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';

import { NavigationStateSpecification, updateNavigationState } from '../state';
import { NavigationLockedGuard } from './navigation-locked.guard';

describe('NavigationLockedGuard', () => {
  let guard: NavigationLockedGuard;
  let store = {
    state$: new BehaviorSubject<State>({
      [NavigationStateSpecification.featureStateKey]: NavigationStateSpecification.initialState
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }]
    });
    guard = TestBed.inject(NavigationLockedGuard);
  });

  it('should return false when navigation is locked', () => {
    store.state$.next(
      updateNavigationState(store.state$.value, {
        navigationLocked: { $set: true }
      })
    );

    (guard.canDeactivate(undefined, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>).subscribe((value) =>
      expect(value).toBeFalsy()
    );
  });

  it('should return true when navigation is not locked', () => {
    store.state$.next(
      updateNavigationState(store.state$.value, {
        navigationLocked: { $set: false }
      })
    );

    (guard.canDeactivate(undefined, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>).subscribe((value) =>
      expect(value).toBeTruthy()
    );
  });
});
