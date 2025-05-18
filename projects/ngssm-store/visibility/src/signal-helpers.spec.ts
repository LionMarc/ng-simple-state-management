import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmVisibilityStateSpecification, updateNgssmVisibilityState } from './state';
import { ElementVisibility, isElementVisible } from './signal-helpers';

describe('Visibility Signal Helpers', () => {
  describe('isElementVisible', () => {
    let store: StoreMock;
    let elementVisible: ElementVisibility;

    beforeEach(() => {
      store = new StoreMock({
        [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
      });
      TestBed.configureTestingModule({
        providers: [{ provide: Store, useValue: store }],
        teardown: { destroyAfterEach: true }
      });
      TestBed.runInInjectionContext(() => (elementVisible = isElementVisible('monitoring')));
    });

    it(`should store the input key`, () => {
      expect(elementVisible.key).toBe('monitoring');
    });

    it(`should be true when element 'monitoring' is visible`, () => {
      store.stateValue = updateNgssmVisibilityState(store.stateValue, {
        elements: {
          ['monitoring']: { $set: true }
        }
      });

      expect(elementVisible.visible()).toBeTrue();
    });

    it(`should be false when element 'monitoring' is not visible`, () => {
      store.stateValue = updateNgssmVisibilityState(store.stateValue, {
        elements: {
          ['monitoring']: { $set: false }
        }
      });

      expect(elementVisible.visible()).toBeFalse();
    });
  });
});
