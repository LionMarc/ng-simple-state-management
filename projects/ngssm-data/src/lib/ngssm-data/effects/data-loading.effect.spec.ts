import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Logger, State } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { DataLoadingEffect } from './data-loading.effect';
import {
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmLoadDataSourceValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceValueAction
} from '../actions';
import { NgssmDataStateSpecification, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

describe('DataLoadingEffect', () => {
  let effect: DataLoadingEffect;
  let logger: Logger;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    });
    spyOn(store, 'dispatchAction');
    TestBed.configureTestingModule({
      imports: [],
      providers: [DataLoadingEffect]
    });
    effect = TestBed.inject(DataLoadingEffect);
    logger = TestBed.inject(Logger);
    spyOn(logger, 'error');
    spyOn(logger, 'information');
  });

  const dataProvidersLoadingFunc = jasmine
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    .createSpy(undefined, (state: State, parameter: any, prperty?: string) => of(['test']))
    .and.callThrough();
  const dataProvidersLoadingFailsFunc = jasmine
    .createSpy(undefined, () => of(['test']))
    .and.returnValue(
      throwError(() => ({
        title: 'bad call'
      }))
    );
  const managersLoadingFunc = jasmine
    .createSpy(undefined, () => {
      return of(['main']);
    })
    .and.callThrough();
  const managersLoadingFailsFunc = jasmine
    .createSpy(undefined, () => {
      return of(['main']);
    })
    .and.returnValue(
      throwError(() => ({
        title: 'bad call'
      }))
    );
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
            dataLoadingFunc: dataProvidersLoadingFunc
          }
        },
        ['data-providers-ko']: {
          $set: {
            key: 'data-providers',
            dataLoadingFunc: dataProvidersLoadingFailsFunc
          }
        },
        ['managers']: {
          $set: {
            key: 'managers',
            dataLoadingFunc: managersLoadingFunc
          }
        },
        ['managers-ko']: {
          $set: {
            key: 'managers',
            dataLoadingFunc: managersLoadingFailsFunc
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

  [NgssmDataActionType.loadDataSourceValue, NgssmDataActionType.loadDataSourceAdditionalPropertyValue].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceValue}'`, () => {
    it(`should log an error when there is no data source for the key set in action`, () => {
      const action = new NgssmLoadDataSourceValueAction('wrong-key');

      effect.processAction(store, store.stateValue, action);

      expect(logger.error).toHaveBeenCalledWith(`No data source setup for key 'wrong-key'`);
    });

    it(`should log an information when data source value is not in '${NgssmDataSourceValueStatus.loading}' status`, () => {
      const action = new NgssmLoadDataSourceValueAction('data-loaded');

      effect.processAction(store, store.stateValue, action);

      expect(logger.information).toHaveBeenCalledWith(
        `Data source value for 'data-loaded' is not in '${NgssmDataSourceValueStatus.loading}' status: '${NgssmDataSourceValueStatus.loaded}'`
      );
    });

    describe(`when loading function contains no inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers');

        effect.processAction(store, store.stateValue, action);

        expect(dataProvidersLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded, ['test'])
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers-ko');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('data-providers-ko', NgssmDataSourceValueStatus.error)
        );
      });
    });

    describe(`when loading function contains an inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers');

        effect.processAction(store, store.stateValue, action);

        expect(managersLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('managers', NgssmDataSourceValueStatus.loaded, ['main'])
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceValueAction('managers-ko');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceValueAction('managers-ko', NgssmDataSourceValueStatus.error)
        );
      });
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceAdditionalPropertyValue}'`, () => {
    it(`should log an error when there is no data source for the key set in action`, () => {
      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('wrong-key', 'my-prop');

      effect.processAction(store, store.stateValue, action);

      expect(logger.error).toHaveBeenCalledWith(`No data source setup for key 'wrong-key'`);
    });

    it(`should log an information when data source property value is not in '${NgssmDataSourceValueStatus.loading}' status`, () => {
      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-loaded', 'my-prop');

      effect.processAction(store, store.stateValue, action);

      expect(logger.information).toHaveBeenCalledWith(
        `Data source additional property value for 'data-loaded' and property 'my-prop' is not in '${NgssmDataSourceValueStatus.loading}' status: '${NgssmDataSourceValueStatus.loaded}'`
      );
    });

    describe(`when loading function contains no inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(dataProvidersLoadingFunc).toHaveBeenCalledWith(jasmine.any(Object), undefined, 'my-prop');
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'my-prop', NgssmDataSourceValueStatus.loaded, ['test'])
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers-ko', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers-ko', 'my-prop', NgssmDataSourceValueStatus.error)
        );
      });
    });

    describe(`when loading function contains an inject call`, () => {
      it(`should execute the loading function`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(managersLoadingFunc).toHaveBeenCalled();
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.loaded}' when loading succeeds`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('managers', 'my-prop', NgssmDataSourceValueStatus.loaded, ['main'])
        );
      });

      it(`should dispatch an action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}' with status '${NgssmDataSourceValueStatus.error}' when loading fails`, () => {
        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('managers-ko', 'my-prop');

        effect.processAction(store, store.stateValue, action);

        expect(store.dispatchAction).toHaveBeenCalledWith(
          new NgssmSetDataSourceAdditionalPropertyValueAction('managers-ko', 'my-prop', NgssmDataSourceValueStatus.error)
        );
      });
    });
  });
});
