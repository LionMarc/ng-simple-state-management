import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { DataSourceValueReducer } from './data-source-value.reducer';
import {
  NgssmClearDataSourceValueAction,
  NgssmDataActionType,
  NgssmLoadDataSourceValueAction,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceValueAction
} from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';

describe('DataSourceValueReducer', () => {
  let reducer: DataSourceValueReducer;
  let state: State;

  beforeEach(() => {
    reducer = new DataSourceValueReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  [
    NgssmDataActionType.loadDataSourceValue,
    NgssmDataActionType.setDataSourceValue,
    NgssmDataActionType.clearDataSourceValue,
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue,
    NgssmDataActionType.setDataSourceAdditionalPropertyValue
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceValue}'`, () => {
    [NgssmDataSourceValueStatus.error, NgssmDataSourceValueStatus.none, NgssmDataSourceValueStatus.loaded].forEach((status) => {
      it(`should set data status to '${NgssmDataSourceValueStatus.loading}' when stored status is '${status}'`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: status,
                additionalProperties: {}
              }
            },
            ['team-managers']: {
              $set: {
                status: NgssmDataSourceValueStatus.none,
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loading);
        expect(selectNgssmDataState(updatedState).dataSourceValues['team-managers'].status).toEqual(NgssmDataSourceValueStatus.none);
      });
    });

    it(`should update the parameter when parameter is set in action`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              dataLifetimeInSeconds: 50,
              lastLoadingDate: DateTime.now().plus({ second: -30 }),
              parameter: 'previous',
              additionalProperties: {}
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: false, parameter: { value: 'next' } });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].parameter).toEqual('next');
    });

    describe(`when data source has additional properties`, () => {
      beforeEach(() => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -30 }),
                parameter: 'previous',
                additionalProperties: {
                  first: {
                    status: NgssmDataSourceValueStatus.loaded,
                    value: 'testing'
                  }
                }
              }
            }
          }
        });
      });

      it(`should clear the additional properties when reloading source`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true, keepAdditionalProperties: false });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({});
      });

      it(`should clear the additional properties when reloading source when options keepAdditionalProperties is set to true`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true, keepAdditionalProperties: true });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
          first: {
            status: NgssmDataSourceValueStatus.loaded,
            value: 'testing'
          }
        });
      });
    });

    describe(`when data source has defined a lifetime for the data`, () => {
      it(`should not update the data status when reload has not been forced and data are still valid`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -30 }),
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loaded);
      });

      it(`should set data status to '${NgssmDataSourceValueStatus.loading}' when reload has been forced and data are still valid`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -30 }),
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loading);
      });

      it(`should set data status to '${NgssmDataSourceValueStatus.loading}' when parameter is set in action`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -30 }),
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: false, parameter: { value: 'testing' } });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loading);
      });

      it(`should set data status to '${NgssmDataSourceValueStatus.loading}' when reload has not been forced but data are not valid anymore`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -80 }),
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loading);
      });

      it(`should set data status to '${NgssmDataSourceValueStatus.loading}' when reload has not been forced but data last loading data is not set`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                additionalProperties: {}
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.loading);
      });
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.setDataSourceValue}'`, () => {
    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              additionalProperties: {}
            }
          }
        }
      });
    });

    it(`should update source value status with the status set in action`, () => {
      const action = new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.status).toEqual(NgssmDataSourceValueStatus.loaded);
    });

    it(`should update source value value with the value set in action`, () => {
      const action = new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded, ['prv1', 'prv3']);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.value).toEqual(['prv1', 'prv3']);
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.clearDataSourceValue}'`, () => {
    const action = new NgssmClearDataSourceValueAction('data-providers');

    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'previous',
              additionalProperties: {}
            }
          }
        }
      });
    });

    it(`should reset source value to undefined`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.value).toBeUndefined();
    });

    it(`should reset status value to '${NgssmDataSourceValueStatus.none}'`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.status).toEqual(NgssmDataSourceValueStatus.none);
    });

    it(`should reset timestamp value to undefined`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.lastLoadingDate).toBeUndefined();
    });

    it(`should reset parameter to undefined if clearParameter is set to true`, () => {
      const updatedState = reducer.updateState(state, new NgssmClearDataSourceValueAction('data-providers', true));

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toBeUndefined();
    });

    it(`should not reset parameter to undefined if clearParameter is not set to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toEqual('previous');
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.setDataSourceParameter}'`, () => {
    it(`should reset source value parameter to undefined when parameter is not set in action`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {}
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterAction('data-providers');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toBeUndefined();
    });

    it(`should update source value parameter with the value set in action`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {}
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterAction('data-providers', 'new parameter');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toEqual('new parameter');
    });
  });
});
