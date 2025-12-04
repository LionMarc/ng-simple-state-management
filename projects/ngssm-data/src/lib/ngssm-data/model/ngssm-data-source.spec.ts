import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataLoading, ngssmLoadDataSourceValue, provideNgssmDataSource } from './ngssm-data-source';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../actions';
import { provideNgssmData } from '../provide-ngssm-data';
import { selectNgssmDataState } from '../state';

describe('NgssmDataSource', () => {
  describe('ngssmLoadDataSourceValue', () => {
    let storeMock: StoreMock;

    beforeEach(() => {
      storeMock = new StoreMock({});
      TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: storeMock }] });
    });

    it(`should return true`, () => {
      const func = ngssmLoadDataSourceValue('testing');
      const result = TestBed.runInInjectionContext(() => func());
      expect(result).toBe(true);
    });

    [true, false].forEach((forceReload) => {
      it(`should dispatch an action of type '${NgssmDataActionType.loadDataSourceValue}'`, () => {
        vi.spyOn(storeMock, 'dispatchAction');

        const func = ngssmLoadDataSourceValue('testing', forceReload);
        TestBed.runInInjectionContext(() => func());

        expect(storeMock.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('testing', { forceReload }));
      });
    });
  });

  describe('provideNgssmDataSource', () => {
    const loader: NgssmDataLoading = () => of([5]);

    beforeEach(() => {
      vitest.useFakeTimers();
    });

    afterEach(() => {
      vitest.useRealTimers();
    });

    it(`should register a data source linked to another one`, async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmData(), provideNgssmDataSource('testing', loader, { linkedToDataSource: 'another-one' })]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;
      await vitest.runAllTimersAsync();

      const state = TestBed.inject(Store).state();
      expect(selectNgssmDataState(state).dataSources['testing'].linkedToDataSource).toBe('another-one');
    });

    it(`should register linked data sources`, async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmData(), provideNgssmDataSource('testing', loader, { linkedDataSources: ['another-one'] })]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;
      await vitest.runAllTimersAsync();

      const state = TestBed.inject(Store).state();
      expect(selectNgssmDataState(state).dataSources['testing'].linkedDataSources).toEqual(['another-one']);
    });
  });
});
