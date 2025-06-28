import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { selectNgssmVisibilityState } from 'ngssm-store/visibility';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';

import { provideNgssmVisibilityTesting } from './provide-ngssm-visibility-testing';
import { ngssmVisibilitySetter } from './ngssm-visibility-setter';

describe('NgssmVisibilitySetter', () => {
  const key = 'my-key';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmVisibilityTesting()]
    });
  });

  it(`should set the eleemtnas visible`, () => {
    ngssmVisibilitySetter().showElement(key);

    const store = TestBed.inject(Store);
    expect(selectNgssmVisibilityState(store.state()).elements[key]).toBeTrue();
  });

  it(`should hide the element`, () => {
    ngssmVisibilitySetter().hideElement(key);

    const store = TestBed.inject(Store);
    expect(selectNgssmVisibilityState(store.state()).elements[key]).toBeFalse();
  });
});
