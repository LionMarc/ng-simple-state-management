import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { Logger, State, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataActionType, NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from '../actions';
import { NgssmDataStateSpecification, updateNgssmDataState } from '../state';
import { NgssmDataSourceLoadSuccessCallback, NgssmDataSourceValueStatus } from '../model';
import { loadDataSourceValueEffect } from './data-source-value-loading.effect';

describe('loadDataSourceValueEffect', () => {
  let logger: Logger;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      testing: {
        description: 'test'
      },
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    });
    vi.spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: Store, useValue: store }]
    });
    logger = TestBed.inject(Logger);
    vi.spyOn(logger, 'error');
    vi.spyOn(logger, 'information');
  });

  const onDataProvidersLoaded = vi.fn((state: State, dataSourceKey: string, parameter: unknown, value: string[]) => {
    const localLogger = inject(Logger);
    localLogger.information(`onLoaded called for ${dataSourceKey} with value ${value}`);
  });

  const onDataProvidersLoadError = vi.fn((state: State, dataSourceKey: string) => {
    const localLogger = inject(Logger);
    localLogger.information(`onLoadError called for ${dataSourceKey}`);
  });

  const onDataProvidersKoLoaded = vi.fn((state: State, dataSourceKey: string) => {
    const localLogger = inject(Logger);
    localLogger.information(`onLoaded called for ${dataSourceKey} on error path`);
  });

  const onDataProvidersKoLoadError = vi.fn((state: State, dataSourceKey: string) => {
    const localLogger = inject(Logger);
    localLogger.information(`onLoadError called for ${dataSourceKey} on error path`);
  });

  const processAction = (action: NgssmLoadDataSourceValueAction) =>
    TestBed.runInInjectionContext(() => loadDataSourceValueEffect(store.stateValue, action));

  const dataProvidersLoadingFunc = vi.fn(() => of(['test']));
  const dataProvidersAdditionalPropertyLoadingFunc = vi.fn((state: State, dataSourceKey, property: string) =>
    of({ label: property, dataSourceKey })
  );
  const dataProvidersLoadingFailsFunc = vi
    .fn(() => of(['test']))
    .mockReturnValue(
      throwError(() => ({
        title: 'bad call'
      }))
    );
  const dataProvidersAdditionalPropertyLoadingFailsFunc = vi
    .fn((state: State, dataSourceKey, property: string) => of({ label: property }))
    .mockReturnValue(
      throwError(() => ({
        title: 'bad call'
      }))
    );
  const managersLoadingFunc = vi.fn(() => {
    const store = inject(Store);
    return of([store.state()['testing']]);
  });
  const managersAdditionalPropertyLoadingFunc = vi.fn((state: State, dataSourceKey, property: string) => {
    const store = inject(Store);
    return of({ state: store.state()['testing'], label: property, key: dataSourceKey });
  });
  const managersLoadingFailsFunc = vi
    .fn(() => {
      return of(['main']);
    })
    .mockReturnValue(
      throwError(() => ({
        title: 'bad call'
      }))
    );
  const managersAdditionalPropertyLoadingFailsFunc = vi.fn((state: State, dataSourceKey, property: string) => {
    const store = inject(Store);
    return throwError(() => ({
      title: 'bad call',
      property,
      state: store.state()['testing']
    }));
  });
  beforeEach(() => {
    const state = updateNgssmDataState(store.stateValue, {
      dataSources: {
        ['data-loaded']: {
          $set: {
            key: 'data-loaded',
            dataLoadingFunc: () => of([])
          }
        },
        ['data-providers']: {
          $set: {
            key: 'data-providers',
            dataLoadingFunc: dataProvidersLoadingFunc,
            additionalPropertyLoadingFunc: dataProvidersAdditionalPropertyLoadingFunc,
            onLoaded: onDataProvidersLoaded as unknown as NgssmDataSourceLoadSuccessCallback,
            onLoadError: onDataProvidersLoadError
          }
        },
        ['data-providers-ko']: {
          $set: {
            key: 'data-providers',
            dataLoadingFunc: dataProvidersLoadingFailsFunc,
            additionalPropertyLoadingFunc: dataProvidersAdditionalPropertyLoadingFailsFunc,
            onLoaded: onDataProvidersKoLoaded as unknown as NgssmDataSourceLoadSuccessCallback,
            onLoadError: onDataProvidersKoLoadError
          }
        },
        ['managers']: {
          $set: {
            key: 'managers',
            dataLoadingFunc: managersLoadingFunc,
            additionalPropertyLoadingFunc: managersAdditionalPropertyLoadingFunc
          }
        },
        ['managers-ko']: {
          $set: {
            key: 'managers',
            dataLoadingFunc: managersLoadingFailsFunc,
            additionalPropertyLoadingFunc: managersAdditionalPropertyLoadingFailsFunc
          }
        }
      },
      dataSourceValues: {
        ['data-loaded']: {
          $set: {
            status: NgssmDataSourceValueStatus.loaded,
            additionalProperties: {
              ['my-prop']: {
                status: NgssmDataSourceValueStatus.loaded
              }
            }
          }
        },
        ['data-providers']: {
          $set: {
            status: NgssmDataSourceValueStatus.loading,
            additionalProperties: {
              ['my-prop']: {
                status: NgssmDataSourceValueStatus.loading
              }
            }
          }
        },
        ['data-providers-ko']: {
          $set: {
            status: NgssmDataSourceValueStatus.loading,
            additionalProperties: {
              ['my-prop']: {
                status: NgssmDataSourceValueStatus.loading
              }
            }
          }
        },
        ['managers']: {
          $set: {
            status: NgssmDataSourceValueStatus.loading,
            additionalProperties: {
              ['my-prop']: {
                status: NgssmDataSourceValueStatus.loading
              }
            }
          }
        },
        ['managers-ko']: {
          $set: {
            status: NgssmDataSourceValueStatus.loading,
            additionalProperties: {
              ['my-prop']: {
                status: NgssmDataSourceValueStatus.loading
              }
            }
          }
        }
      }
    });
    store.stateValue = state;
  });

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceValue}'`, () => {
    it(`should log an error when there is no data source for the key set in action`, () => {
      const action = new NgssmLoadDataSourceValueAction('wrong-key');

      processAction(action);

      expect(logger.error).toHaveBeenCalledWith(`No data source setup for key 'wrong-key'`);
    });

    it(`should log an information when data source value is not in '${NgssmDataSourceValueStatus.loading}' status`, () => {
      const action = new NgssmLoadDataSourceValueAction('data-loaded');

      processAction(action);

      expect(logger.information).toHaveBeenCalledWith(
        `Data source value for 'data-loaded' is not in '${NgssmDataSourceValueStatus.loading}' status: '${NgssmDataSourceValueStatus.loaded}'`
      );
    });

    describe(`when loading function contains no inject call`, () => {
      it('should not start a second load for the same key while one is in progress', () => {
        const loadingSubject = new Subject<string[]>();
        const loadingFunc = vi.fn(() => loadingSubject.asObservable());
        const state = updateNgssmDataState(store.stateValue, {
          dataSources: {
            ['data-in-flight']: {
              $set: {
                key: 'data-in-flight',
                dataLoadingFunc: loadingFunc
              }
            }
          },
          dataSourceValues: {
            ['data-in-flight']: {
              $set: {
                status: NgssmDataSourceValueStatus.loading,
                additionalProperties: {}
              }
            }
          }
        });
        const action = new NgssmLoadDataSourceValueAction('data-in-flight');

        TestBed.runInInjectionContext(() => loadDataSourceValueEffect(state, action));
        TestBed.runInInjectionContext(() => loadDataSourceValueEffect(state, action));

        expect(loadingFunc).toHaveBeenCalledTimes(1);
        expect(logger.information).toHaveBeenCalledWith(`Data source value for 'data-in-flight' is already loading`);

        loadingSubject.complete();
        TestBed.runInInjectionContext(() => loadDataSourceValueEffect(state, action));

        expect(loadingFunc).toHaveBeenCalledTimes(2);
      });

      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers');

        processAction(action);

        expect(dataProvidersLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded, ['test'])
        );
        expect(onDataProvidersLoaded).toHaveBeenCalledWith(store.stateValue, 'data-providers', undefined, ['test']);
        expect(onDataProvidersLoadError).not.toHaveBeenCalled();
        expect(logger.information).toHaveBeenCalledWith('onLoaded called for data-providers with value test');
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers-ko');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('data-providers-ko', NgssmDataSourceValueStatus.error, undefined, {
            title: 'bad call'
          } as unknown as HttpErrorResponse)
        );
        expect(onDataProvidersKoLoadError).toHaveBeenCalledWith(store.stateValue, 'data-providers-ko', undefined, {
          title: 'bad call'
        });
        expect(onDataProvidersKoLoaded).not.toHaveBeenCalled();
        expect(logger.information).toHaveBeenLastCalledWith('onLoadError called for data-providers-ko on error path');
      });
    });

    describe(`when loading function contains an inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers');

        processAction(action);

        expect(managersLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('managers', NgssmDataSourceValueStatus.loaded, [
            {
              description: 'test'
            }
          ])
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers-ko');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('managers-ko', NgssmDataSourceValueStatus.error, undefined, {
            title: 'bad call'
          } as unknown as HttpErrorResponse)
        );
      });
    });
  });
});
