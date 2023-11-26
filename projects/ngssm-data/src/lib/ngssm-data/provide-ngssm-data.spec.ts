import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { State, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataStateSpecification } from './state';
import { provideNgssmData } from './provide-ngssm-data';
import { NgssmDataActionType, NgssmInitDataSourceValuesAction } from './actions';
import { NgssmDataLoading, provideNgssmDataSource } from './model';

describe('provideNgssmData', () => {
  describe('Initialization of the data source values', () => {
    let store: StoreMock;

    beforeEach(() => {
      store = new StoreMock({
        [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
      });
      spyOn(store, 'dispatchAction');
    });

    it(`should not dispatch an action of type ${NgssmDataActionType.initDataSourceValues} when no data source is defined`, async () => {
      await TestBed.configureTestingModule({
        providers: [{ provide: Store, useValue: store }, provideNgssmData()]
      }).compileComponents();
      await TestBed.inject(ApplicationInitStatus).donePromise;

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it(`should dispatch an action of type ${NgssmDataActionType.initDataSourceValues} when some data sources are defined`, async () => {
      const firstSourceLoading: NgssmDataLoading = (state: State): Observable<string[]> => {
        return of([]);
      };
      const secondSourceLoading: NgssmDataLoading = (state: State): Observable<string[]> => {
        return of([]);
      };
      await TestBed.configureTestingModule({
        providers: [
          { provide: Store, useValue: store },
          provideNgssmDataSource('first', firstSourceLoading),
          provideNgssmDataSource('second', secondSourceLoading),
          provideNgssmData()
        ]
      }).compileComponents();
      await TestBed.inject(ApplicationInitStatus).donePromise;

      expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmInitDataSourceValuesAction(['first', 'second']));
    });
  });
});
