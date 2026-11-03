import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Logger, State, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import {
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction
} from '../actions';
import { NgssmDataStateSpecification, updateNgssmDataState } from '../state';
import { NgssmDataSourceLoadSuccessCallback, NgssmDataSourceValueStatus } from '../model';
import { loadDataSourceAdditionalPropertyValueEffect } from './data-source-additional-property-value-loading.effect';

describe('loadDataSourceAdditionalPropertyValueEffect', () => {
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

  const processAction = (action: NgssmLoadDataSourceAdditionalPropertyValueAction) =>
    TestBed.runInInjectionContext(() => loadDataSourceAdditionalPropertyValueEffect(store.stateValue, action));

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

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceAdditionalPropertyValue}'`, () => {
    it(`should log an error when there is no data source for the key set in action`, () => {
      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('wrong-key', 'my-prop');

      processAction(action);

      expect(logger.error).toHaveBeenCalledWith(`No data source setup for key 'wrong-key'`);
    });

    it(`should log an information when data source property value is not in '${NgssmDataSourceValueStatus.loading}' status`, () => {
      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-loaded', 'my-prop');

      processAction(action);

      expect(logger.information).toHaveBeenCalledWith(
        `Data source additional property value for 'data-loaded' and property 'my-prop' is not in '${NgssmDataSourceValueStatus.loading}' status: '${NgssmDataSourceValueStatus.loaded}'`
      );
    });

    describe(`when loading function contains no inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop');

        processAction(action);

        expect(dataProvidersAdditionalPropertyLoadingFunc).toHaveBeenCalledWith(expect.any(Object), 'data-providers', 'my-prop');
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop', NgssmDataSourceValueStatus.loaded, {
            label: 'my-prop',
            dataSourceKey: 'data-providers'
          })
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers-ko', 'my-prop');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction(
            'data-providers-ko',
            'my-prop',
            NgssmDataSourceValueStatus.error,
            undefined,
            undefined,
            {
              title: 'bad call'
            } as unknown as HttpErrorResponse
          )
        );
      });
    });

    describe(`when loading function contains an inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers', 'my-prop');

        processAction(action);

        expect(managersAdditionalPropertyLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers', 'my-prop');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('managers', 'my-prop', NgssmDataSourceValueStatus.loaded, {
            state: {
              description: 'test'
            },
            label: 'my-prop',
            key: 'managers'
          })
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers-ko', 'my-prop');

        processAction(action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction(
            'managers-ko',
            'my-prop',
            NgssmDataSourceValueStatus.error,
            undefined,
            undefined,
            {
              title: 'bad call',
              property: 'my-prop',
              state: {
                description: 'test'
              }
            } as unknown as HttpErrorResponse
          )
        );
      });
    });
  });
});
