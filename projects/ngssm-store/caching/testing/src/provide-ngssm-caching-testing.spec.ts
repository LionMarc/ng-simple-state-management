import { TestBed } from '@angular/core/testing';

import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';
import { NgssmCachingStateSpecification } from 'ngssm-store/caching';

import { ngssmCachingStateInitializer, provideNgssmCachingTesting } from './provide-ngssm-caching-testing';

describe('provideNgssmCachingTesting', () => {
  it(`should throw if StoreMock is not registered`, () => {
    TestBed.configureTestingModule({});
    try {
      TestBed.runInInjectionContext(() => ngssmCachingStateInitializer());
      expect(true).toBeFalse();
    } catch (error) {
      expect((error as Error).message).toEqual('StoreMock is not registered.');
    }
  });

  it(`should register the ngssm data state in the mocked state`, () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmCachingTesting()]
    });

    const store = TestBed.inject(Store) as unknown as StoreMock;
    expect(store.stateValue[NgssmCachingStateSpecification.featureStateKey]).toBeTruthy();
  });
});
