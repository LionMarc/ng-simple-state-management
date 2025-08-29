import { ApplicationInitStatus, effect, inject } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { DateTime } from 'luxon';

import { Action, Logger, provideConsoleAppender, Store } from 'ngssm-store';

import { provideNgssmData } from './provide-ngssm-data';
import { NgssmDataLoading, NgssmDataSourceValueStatus, provideNgssmDataSource } from './model';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from './actions';
import { selectNgssmDataSourceValue } from './selectors';
import { NgssmDataStateSpecification, selectNgssmDataState, NgssmDataState } from './state';

const dependentSourceKey = 'dependent';
const dependentSourceLoader: NgssmDataLoading<string[]> = () => {
  return of(['value1']).pipe(delay(1));
};

const dependencySourceKey = 'dependency';
const dependencySourceLoader: NgssmDataLoading<string[]> = () => {
  return of(['value2']).pipe(delay(1));
};

const waitDataSourcesRegistered = async () => {
  let resolver: (value: boolean | PromiseLike<boolean>) => void;
  const promise = new Promise<boolean>((resolve) => (resolver = resolve));

  TestBed.runInInjectionContext(() => {
    const store = inject(Store);
    effect(() => {
      const action = store.processedAction();
      if (action.type === NgssmDataActionType.registerDataSources) {
        resolver(true);
      }
    });
  });

  await promise;
};

describe('Data sourcewith dependency', () => {
  let store: Store;
  let logger: Logger;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNgssmData(),
        provideConsoleAppender('test'),
        provideNgssmDataSource(dependentSourceKey, dependentSourceLoader, { dependsOnDataSource: dependencySourceKey }),
        provideNgssmDataSource(dependencySourceKey, dependencySourceLoader, { dataLifetimeInSeconds: 600 })
      ]
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
    TestBed.tick();

    store = TestBed.inject(Store);
    logger = TestBed.inject(Logger);

    await waitDataSourcesRegistered();
  });

  it(`should load the dependency source when trying to load the dependent source and the dependency is not loader`, fakeAsync(async () => {
    const actions: Action[] = [];

    let resolver: (value: boolean | PromiseLike<boolean>) => void;
    const promise = new Promise<boolean>((resolve) => (resolver = resolve));

    TestBed.runInInjectionContext(() => {
      effect(() => {
        const action = store.processedAction();
        if ([NgssmDataActionType.loadDataSourceValue as string, NgssmDataActionType.setDataSourceValue as string].includes(action.type)) {
          actions.push(action);
        }

        if (actions.length === 5) {
          resolver(true);
        }
      });
    });

    store.dispatchAction(new NgssmLoadDataSourceValueAction(dependentSourceKey, { forceReload: true }));

    tick(100);

    await promise;

    expect(actions.length).toEqual(5);
    expect(actions[0]).toEqual(new NgssmLoadDataSourceValueAction(dependentSourceKey, { forceReload: true }));
    expect(actions[1]).toEqual(new NgssmLoadDataSourceValueAction(dependencySourceKey));
    expect(actions[2]).toEqual(new NgssmSetDataSourceValueAction(dependencySourceKey, NgssmDataSourceValueStatus.loaded, ['value2']));
    expect(actions[3]).toEqual(new NgssmLoadDataSourceValueAction(dependentSourceKey, { forceReload: true }));
    expect(actions[4]).toEqual(new NgssmSetDataSourceValueAction(dependentSourceKey, NgssmDataSourceValueStatus.loaded, ['value1']));

    expect(selectNgssmDataSourceValue(store.state(), dependencySourceKey)?.value).toEqual(['value2']);
    expect(selectNgssmDataSourceValue(store.state(), dependentSourceKey)?.value).toEqual(['value1']);

    expect(selectNgssmDataState(store.state()).delayedActions[dependencySourceKey]).toBeFalsy();
  }));

  it(`should not load the dependency source when trying to load the dependent source and the dependency is loader`, fakeAsync(async () => {
    const state = store.state();
    (state[NgssmDataStateSpecification.featureStateKey] as NgssmDataState).dataSourceValues[dependencySourceKey] = {
      status: NgssmDataSourceValueStatus.loaded,
      additionalProperties: {}
    };

    const actions: Action[] = [];

    let resolver: (value: boolean | PromiseLike<boolean>) => void;
    const promise = new Promise<boolean>((resolve) => (resolver = resolve));

    TestBed.runInInjectionContext(() => {
      effect(() => {
        const action = store.processedAction();
        if ([NgssmDataActionType.loadDataSourceValue as string, NgssmDataActionType.setDataSourceValue as string].includes(action.type)) {
          actions.push(action);
        }

        if (actions.length === 2) {
          resolver(true);
        }
      });
    });

    store.dispatchAction(new NgssmLoadDataSourceValueAction(dependentSourceKey, { forceReload: true }));

    tick(100);

    await promise;

    expect(actions.length).toEqual(2);
    expect(actions[0]).toEqual(new NgssmLoadDataSourceValueAction(dependentSourceKey, { forceReload: true }));
    expect(actions[1]).toEqual(new NgssmSetDataSourceValueAction(dependentSourceKey, NgssmDataSourceValueStatus.loaded, ['value1']));

    expect(selectNgssmDataSourceValue(store.state(), dependentSourceKey)?.value).toEqual(['value1']);

    expect(selectNgssmDataState(store.state()).delayedActions[dependencySourceKey]).toBeFalsy();
  }));

  it(`should not log an error when data source depends on no other data source and data source is already loaded`, fakeAsync(async () => {
    const state = store.state();
    const dataSourceValue = (state[NgssmDataStateSpecification.featureStateKey] as NgssmDataState).dataSourceValues[dependencySourceKey];
    dataSourceValue.status = NgssmDataSourceValueStatus.loaded;
    dataSourceValue.lastLoadingDate = DateTime.now();

    const actions: Action[] = [];

    spyOn(logger, 'error');

    let resolver: (value: boolean | PromiseLike<boolean>) => void;
    const promise = new Promise<boolean>((resolve) => (resolver = resolve));

    TestBed.runInInjectionContext(() => {
      effect(() => {
        const action = store.processedAction();
        if ([NgssmDataActionType.loadDataSourceValue as string, NgssmDataActionType.setDataSourceValue as string].includes(action.type)) {
          actions.push(action);
        }

        if (actions.length === 1) {
          resolver(true);
        }
      });
    });

    store.dispatchAction(new NgssmLoadDataSourceValueAction(dependencySourceKey));

    tick(100);

    await promise;

    expect(logger.error).not.toHaveBeenCalled();
  }));
});
