import { ApplicationInitStatus, effect, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, isObservable, of } from 'rxjs';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import {
  NGSSM_COMPUTED_DATA_SOURCE,
  NGSSM_DATA_SOURCE,
  NgssmDataLoading,
  ngssmLoadDataSourceValue,
  provideNgssmComputedDataSource,
  provideNgssmDataSource,
  provideNgssmDataSourceSync
} from './ngssm-data-source';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from './ngssm-data-source-value';
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

  describe('provideNgssmComputedDataSource', () => {
    it('should register a computed source and its linked sources', () => {
      TestBed.configureTestingModule({
        providers: [provideNgssmComputedDataSource('computed', () => 'value', { linkedToDataSources: ['first', 'second'] })]
      });

      const [dataSource] = TestBed.inject(NGSSM_COMPUTED_DATA_SOURCE);
      expect(dataSource.key).toBe('computed');
      expect(dataSource.linkedToDataSources).toEqual(['first', 'second']);
      expect(dataSource.computationFunc({})).toBe('value');
    });

    const waitDataSourceUpdated = async () => {
      let resolver: (value: boolean | PromiseLike<boolean>) => void;
      const promise = new Promise<boolean>((resolve) => (resolver = resolve));
      TestBed.runInInjectionContext(() => {
        const store = inject(Store);
        effect(() => {
          const action = store.processedAction();
          if (action.type === NgssmDataActionType.setDataSourceValue) {
            resolver(true);
          }
        });
      });

      await promise;
    };

    it('should register and compute the source when a linked source is updated', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideNgssmData(),
          provideNgssmDataSource('source', () => of('value')),
          provideNgssmComputedDataSource(
            'computed',
            (state) => `${selectNgssmDataState(state).dataSourceValues['source']?.value}-derived`,
            { linkedToDataSource: 'source' }
          )
        ]
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;

      const store = TestBed.inject(Store);
      store.dispatchAction(new NgssmSetDataSourceValueAction('source', NgssmDataSourceValueStatus.loaded, 'updated'));
      await waitDataSourceUpdated();

      expect(selectNgssmDataState(store.state()).dataSourceValues['computed']?.value).toBe('updated-derived');
    });
  });
});
