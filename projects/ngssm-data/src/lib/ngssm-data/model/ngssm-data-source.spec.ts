import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, isObservable, of } from 'rxjs';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import {
  NGSSM_DATA_SOURCE,
  NgssmDataLoading,
  ngssmLoadDataSourceValue,
  provideNgssmDataSource,
  provideNgssmDataSourceSync
} from './ngssm-data-source';
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
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(`should register a data source linked to another one`, async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmData(), provideNgssmDataSource('testing', loader, { linkedToDataSource: 'another-one' })]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;
      await vi.runAllTimersAsync();

      const state = TestBed.inject(Store).state();
      expect(selectNgssmDataState(state).dataSources['testing'].linkedToDataSource).toBe('another-one');
    });

    it(`should register a data source linked to multiple sources`, async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmData(), provideNgssmDataSource('testing', loader, { linkedToDataSources: ['one', 'two'] })]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;
      await vi.runAllTimersAsync();

      const state = TestBed.inject(Store).state();
      expect(selectNgssmDataState(state).dataSources['testing'].linkedToDataSources).toEqual(['one', 'two']);
    });

    it(`should register linked data sources`, async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmData(), provideNgssmDataSource('testing', loader, { linkedDataSources: ['another-one'] })]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;
      await vi.runAllTimersAsync();

      const state = TestBed.inject(Store).state();
      expect(selectNgssmDataState(state).dataSources['testing'].linkedDataSources).toEqual(['another-one']);
    });
  });

  describe('provideNgssmDataSourceSync', () => {
    it('should register synchronous values as an Observable loader', async () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmDataSourceSync('testing', () => ['first', 'second'])]
      });

      const dataSources = TestBed.inject(NGSSM_DATA_SOURCE);
      const dataSource = dataSources.find((source) => source.key === 'testing');
      if (!dataSource) {
        throw new Error('Expected the synchronous data source to be registered');
      }

      const result = dataSource.dataLoadingFunc({}, 'testing');

      expect(isObservable(result)).toBe(true);
      await expect(firstValueFrom(result)).resolves.toEqual(['first', 'second']);
    });
  });
});
