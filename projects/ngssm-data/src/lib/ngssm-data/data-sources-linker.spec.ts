import { ApplicationInitStatus, provideAppInitializer } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmDataStateSpecification, updateNgssmDataState } from './state';
import { dataSourcesLinkerInitializer } from './data-sources-linker';
import { NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from './actions';
import { NgssmDataSourceValueStatus } from './model';

describe('data-sources-linker', () => {
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    });

    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }, provideAppInitializer(dataSourcesLinkerInitializer)]
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
  });

  it(`should force the reload of 'content' when data source 'url' is updated and 'content' is linked to 'url'`, () => {
    const state = updateNgssmDataState(store.stateValue, {
      dataSources: {
        url: {
          $set: {
            key: 'url',
            dataLoadingFunc: () => of('')
          }
        },
        content: {
          $set: {
            key: 'content',
            dataLoadingFunc: () => of(''),
            linkedToDataSource: 'url'
          }
        }
      }
    });

    store.stateValue = state;

    spyOn(store, 'dispatchAction');

    store.processedAction.set(new NgssmSetDataSourceValueAction('url', NgssmDataSourceValueStatus.loaded, 'test'));
    TestBed.flushEffects();

    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('content', { forceReload: true }));
  });

  it(`should force the reload of all the linked data sources`, () => {
    const state = updateNgssmDataState(store.stateValue, {
      dataSources: {
        url: {
          $set: {
            key: 'url',
            dataLoadingFunc: () => of('')
          }
        },
        content: {
          $set: {
            key: 'content',
            dataLoadingFunc: () => of(''),
            linkedToDataSource: 'url'
          }
        },
        updated: {
          $set: {
            key: 'updated',
            dataLoadingFunc: () => of(''),
            linkedToDataSource: 'url'
          }
        },
        somethingElse: {
          $set: {
            key: 'content',
            dataLoadingFunc: () => of('')
          }
        }
      }
    });

    store.stateValue = state;

    spyOn(store, 'dispatchAction');

    store.processedAction.set(new NgssmSetDataSourceValueAction('url', NgssmDataSourceValueStatus.loaded, 'test'));
    TestBed.flushEffects();

    expect(store.dispatchAction).toHaveBeenCalledTimes(2);
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('content', { forceReload: true }));
    expect(store.dispatchAction).toHaveBeenCalledWith(new NgssmLoadDataSourceValueAction('updated', { forceReload: true }));
  });
});
