import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ApplicationInitStatus, inject } from '@angular/core';
import { of } from 'rxjs';

import { Logger, provideNgssmFeatureState, Store } from 'ngssm-store';

import { NgssmLoadDataSourceAdditionalPropertyValueAction, NgssmLoadDataSourceValueAction } from './actions';
import { NgssmAdditionalPropertyLoading, NgssmDataLoading } from './model';
import { NgssmDataStateSpecification } from './state';
import { NgssmRegisterDataSourceAction } from './actions';
import { provideNgssmData } from './provide-ngssm-data';
import { selectNgssmDataSourceAdditionalPropertyValue, selectNgssmDataSourceValue } from './selectors';

const dataSourceKey = 'data-source';
const dataLoading: NgssmDataLoading<string> = () => {
  inject(Logger).information('Loading data...');
  return of('data');
};
const dataPropertyLoading: NgssmAdditionalPropertyLoading<string> = (state, dataSourceKey, property) => {
  const value = selectNgssmDataSourceValue<string>(state, dataSourceKey)?.value;
  return of(`${value} - ${property}`);
};

describe('postLoadingActionExecutorInitializer', () => {
  let store: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNgssmFeatureState(NgssmDataStateSpecification.featureStateKey, NgssmDataStateSpecification.initialState),
        provideNgssmData()
      ]
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    store = TestBed.inject(Store);

    store.dispatchAction(
      new NgssmRegisterDataSourceAction({
        key: dataSourceKey,
        dataLoadingFunc: dataLoading,
        additionalPropertyLoadingFunc: dataPropertyLoading
      })
    );
  });

  it('should execute post-loading action when data is not already loaded', fakeAsync(() => {
    store.dispatchAction(new NgssmLoadDataSourceValueAction(dataSourceKey));
    flush();

    let value: string | undefined;
    const postLoadingAction = () => {
      const store = inject(Store);
      value = selectNgssmDataSourceAdditionalPropertyValue<string>(store.state(), dataSourceKey, 'test')?.value;
    };

    const action = new NgssmLoadDataSourceAdditionalPropertyValueAction(dataSourceKey, 'test', undefined, postLoadingAction);

    store.dispatchAction(action);
    flush();
    TestBed.tick();
    flush();

    expect(value).toBe('data - test');
    flush();
  }));

  it('should execute post-loading action when data is already loaded', fakeAsync(() => {
    store.dispatchAction(new NgssmLoadDataSourceValueAction(dataSourceKey));
    flush();

    let value: string | undefined;
    const postLoadingAction = () => {
      const store = inject(Store);
      value = selectNgssmDataSourceAdditionalPropertyValue<string>(store.state(), dataSourceKey, 'test')?.value;
    };

    const action = new NgssmLoadDataSourceAdditionalPropertyValueAction(dataSourceKey, 'test', undefined, postLoadingAction);

    store.dispatchAction(action);
    flush();
    TestBed.tick();
    flush();

    expect(value).toBe('data - test');
    flush();

    value = 'wrong value';
    store.dispatchAction(action);
    flush();
    TestBed.tick();
    flush();

    expect(value).toBe('data - test');
  }));
});
