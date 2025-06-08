import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Store } from 'ngssm-store';
import { NgssmDataLoading, NgssmDataSourceValueStatus, provideNgssmDataSource, selectNgssmDataSourceValue } from 'ngssm-data';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';

import { provideNgssmDataTesting } from './provide-ngssm-data-testing';
import { NgssmDataSourceValueSetter } from './ngssm-data-source-value-setter';

describe('NgssmDataSourceValueSetter', () => {
  beforeEach(() => {
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
  });

  it(`should update the status of a data source`, () => {
    const setter = TestBed.inject(NgssmDataSourceValueSetter);
    setter.setDataSourceStatus('first', NgssmDataSourceValueStatus.loading);

    const store = TestBed.inject(Store);
    expect(selectNgssmDataSourceValue(store.state(), 'first')?.status).toEqual(NgssmDataSourceValueStatus.loading);
  });

  it(`should update the value of a data source`, () => {
    const setter = TestBed.inject(NgssmDataSourceValueSetter);
    setter.setDataSourceValue('first', { label: 'testing' });

    const store = TestBed.inject(Store);
    expect(selectNgssmDataSourceValue(store.state(), 'first')?.value).toEqual({ label: 'testing' });
  });

  it(`should update the status and the value of a data source`, () => {
    const setter = TestBed.inject(NgssmDataSourceValueSetter);
    setter.setDataSourceValue('first', { label: 'testing' }).setDataSourceStatus('first', NgssmDataSourceValueStatus.loading);

    const store = TestBed.inject(Store);
    expect(selectNgssmDataSourceValue(store.state(), 'first')?.value).toEqual({ label: 'testing' });
    expect(selectNgssmDataSourceValue(store.state(), 'first')?.status).toEqual(NgssmDataSourceValueStatus.loading);
  });
});
