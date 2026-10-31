import { TestBed } from '@angular/core/testing';

import { provideNgssmStore } from '../provide-ngssm-store';
import { Store } from '../store';
import { provideNgssmFeatureState } from './provide-feature-state';

describe('provideNgssmFeatureState', () => {
  it('should initialize the feature state when the store is created', () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStore(), provideNgssmFeatureState('my-feature', { value: 'initialized' })]
    });

    const store = TestBed.inject(Store);

    expect(store.state()).toEqual({
      'my-feature': { value: 'initialized' }
    });
  });
});
