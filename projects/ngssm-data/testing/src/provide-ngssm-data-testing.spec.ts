import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Store } from 'ngssm-store';
import {
  NgssmDataLoading,
  NgssmDataSourceValueStatus,
  NgssmDataStateSpecification,
  provideNgssmDataSource,
  selectNgssmDataSourceValue
} from 'ngssm-data';
import { provideNgssmStoreTesting, StoreMock } from 'ngssm-store/testing';

import { ngssmDataStateAndSourcesInitializer, provideNgssmDataTesting } from './provide-ngssm-data-testing';

describe('provideNgssmDataTesting', () => {
  it(`should throw if StoreMock is not registered`, () => {
    TestBed.configureTestingModule({});
    try {
      TestBed.runInInjectionContext(() => ngssmDataStateAndSourcesInitializer());
      expect(true).toBeFalse();
    } catch (error) {
      expect((error as Error).message).toEqual('StoreMock is not registered.');
    }
  });

  it(`should register the ngssm data state in the mocked state`, () => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting(), provideNgssmDataTesting()]
    });

    const store = TestBed.inject(Store) as unknown as StoreMock;
    expect(store.stateValue[NgssmDataStateSpecification.featureStateKey]).toBeTruthy();
  });

  it(`should initlaize the ngssm data sources values in the mocked state`, () => {
    const firstSourceLoading: NgssmDataLoading = (): Observable<string[]> => {
      return of([]);
    };
    const secondSourceLoading: NgssmDataLoading = (): Observable<string[]> => {
      return of([]);
    };

    TestBed.configureTestingModule({
      providers: [
        provideNgssmStoreTesting(),
        provideNgssmDataTesting(),
        provideNgssmDataSource('first', firstSourceLoading, { dataLifetimeInSeconds: 560 }),
        provideNgssmDataSource('second', secondSourceLoading)
      ]
    });

    const store = TestBed.inject(Store) as unknown as StoreMock;
    expect(selectNgssmDataSourceValue(store.stateValue, 'first').status).toEqual(NgssmDataSourceValueStatus.none);
    expect(selectNgssmDataSourceValue(store.stateValue, 'second').status).toEqual(NgssmDataSourceValueStatus.none);
  });
});
