import { ApplicationInitStatus, effect } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { Action, provideConsoleAppender, Store } from 'ngssm-store';

import { provideNgssmData } from './provide-ngssm-data';
import { NgssmDataLoading, provideNgssmDataSource } from './model';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from './actions';
import { selectNgssmDataSourceValue } from './selectors';
import { selectNgssmDataState } from './state';

const dependentSourceKey = 'dependent';
const dependentSourceLoader: NgssmDataLoading<string[]> = () => {
  return of(['value1']).pipe(delay(1));
};

const dependencySourceKey = 'dependency';
const dependencySourceLoader: NgssmDataLoading<string[]> = () => {
  return of(['value2']).pipe(delay(1));
};

describe('Data sourcewith dependency', () => {
  let store: Store;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNgssmData(),
        provideConsoleAppender('test'),
        provideNgssmDataSource(dependentSourceKey, dependentSourceLoader, { dependsOnDataSource: dependencySourceKey }),
        provideNgssmDataSource(dependencySourceKey, dependencySourceLoader)
      ]
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
    TestBed.tick();

    store = TestBed.inject(Store);
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

    expect(selectNgssmDataSourceValue(store.state(), dependencySourceKey)?.value).toEqual(['value2']);
    expect(selectNgssmDataSourceValue(store.state(), dependentSourceKey)?.value).toEqual(['value1']);

    expect(selectNgssmDataState(store.state()).delayedActions[dependencySourceKey]).toBeFalsy();
  }));
});
