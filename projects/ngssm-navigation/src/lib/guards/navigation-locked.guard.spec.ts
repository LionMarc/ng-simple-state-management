import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';

import { NavigationStateSpecification, updateNavigationState } from '../state';
import { NavigationLockedGuard } from './navigation-locked.guard';
import { StoreMock } from 'ngssm-store/testing';

describe('NavigationLockedGuard', () => {
  let guard: NavigationLockedGuard;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      [NavigationStateSpecification.featureStateKey]: NavigationStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }]
    });
    guard = TestBed.inject(NavigationLockedGuard);
  });

  it('should return false when navigation is locked', () => {
    store.stateValue = updateNavigationState(store.stateValue, {
      navigationLocked: { $set: true }
    });

    (guard.canDeactivate() as Observable<boolean>).subscribe((value) => expect(value).toBeFalsy());
  });

  it('should return true when navigation is not locked', () => {
    store.stateValue = updateNavigationState(store.stateValue, {
      navigationLocked: { $set: false }
    });

    (guard.canDeactivate() as Observable<boolean>).subscribe((value) => expect(value).toBeTruthy());
  });
});
