import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NavigationStateSpecification, updateNavigationState } from '../state';
import { isNavigationLocked, isNavigationUnLocked } from './navigation-guards';

describe('Navigation guards', () => {
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      [NavigationStateSpecification.featureStateKey]: NavigationStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }]
    });
  });

  describe('isNavigationLocked', () => {
    it('should return true when navigation is locked', () => {
      store.stateValue = updateNavigationState(store.stateValue, {
        navigationLocked: { $set: true }
      });

      const result = TestBed.runInInjectionContext(() => isNavigationLocked());

      expect(result).toBeTruthy();
    });

    it('should return false when navigation is not locked', () => {
      store.stateValue = updateNavigationState(store.stateValue, {
        navigationLocked: { $set: false }
      });

      const result = TestBed.runInInjectionContext(() => isNavigationLocked());

      expect(result).toBeFalsy();
    });
  });

  describe('isNavigationUnLocked', () => {
    it('should return false when navigation is locked', () => {
      store.stateValue = updateNavigationState(store.stateValue, {
        navigationLocked: { $set: true }
      });

      const result = TestBed.runInInjectionContext(() => isNavigationUnLocked());

      expect(result).toBeFalsy();
    });

    it('should return true when navigation is not locked', () => {
      store.stateValue = updateNavigationState(store.stateValue, {
        navigationLocked: { $set: false }
      });

      const result = TestBed.runInInjectionContext(() => isNavigationUnLocked());

      expect(result).toBeTruthy();
    });
  });
});
