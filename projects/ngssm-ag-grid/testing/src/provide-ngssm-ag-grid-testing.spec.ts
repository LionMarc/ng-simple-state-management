import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';
import { AgGridStateSpecification } from 'ngssm-ag-grid';

import { ngssmAgGridStateInitializer, provideNgssmAgGridTesting } from './provide-ngssm-ag-grid-testing';

describe('provideNgssmAgGridTesting', () => {
  it(`should throw if StoreMock is not registered`, () => {
    TestBed.configureTestingModule({});
    try {
      TestBed.runInInjectionContext(() => ngssmAgGridStateInitializer());
      expect(true).toBeFalse();
    } catch (error) {
      expect((error as Error).message).toEqual('StoreMock is not registered.');
    }
  });

  it(`should register the ngssm ag grid state in the mocked state`, () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmAgGridTesting()]
    });

    const store = TestBed.inject(Store) as unknown as StoreMock;
    expect(store.stateValue[AgGridStateSpecification.featureStateKey]).toBeTruthy();
  });
});
