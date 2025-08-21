import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { LoadDataSourceValueReducer } from './load-data-source-value.reducer';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSource } from 'ngssm-data';

describe('LoadLoadDataSourceValueReducer', () => {
  let reducer: LoadDataSourceValueReducer;
  let state: State;

  beforeEach(() => {
    reducer = new LoadDataSourceValueReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };

    state = updateNgssmDataState(state, {
      dataSources: {
        ['data-providers']: { $set: {} as unknown as NgssmDataSource },
        ['team-managers']: { $set: {} as unknown as NgssmDataSource }
      }
    });
  });

  [NgssmDataActionType.loadDataSourceValue].forEach((actionType: string) => {
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

    it(`should set the valueOutdated to false`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              dataLifetimeInSeconds: 50,
              lastLoadingDate: DateTime.now().plus({ second: -30 }),
              parameter: 'previous',
              additionalProperties: {},
              valueOutdated: true
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].valueOutdated).toEqual(false);
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
                },
                value: {
                  label: 'testing'
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

      it(`should clear the value when option resetValue is set to true`, () => {
        const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true, resetValue: true });

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].value).toBeFalsy();
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

    describe('when data source depends on another one', () => {
      beforeEach(() => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.none,
                additionalProperties: {}
              }
            },
            ['team-managers']: {
              $set: {
                status: NgssmDataSourceValueStatus.none,
                additionalProperties: {}
              }
            }
          },
          dataSources: {
            ['data-providers']: {
              dependsOnDataSource: { $set: 'team-managers' }
            }
          }
        });
      });

      describe(`when dependency source is not loaded`, () => {
        beforeEach(() => {
          state = updateNgssmDataState(state, {
            dataSourceValues: {
              ['team-managers']: {
                status: { $set: NgssmDataSourceValueStatus.none }
              },
              ['data-providers']: {
                status: { $set: NgssmDataSourceValueStatus.none }
              }
            }
          });
        });

        it(`should not update the status of the source`, () => {
          const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true });

          const updatedState = reducer.updateState(state, action);

          expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].status).toEqual(NgssmDataSourceValueStatus.none);
        });

        it(`should store the action in order to execute it later`, () => {
          const action = new NgssmLoadDataSourceValueAction('data-providers', { forceReload: true });

          const updatedState = reducer.updateState(state, action);

          expect(selectNgssmDataState(updatedState).delayedActions['team-managers']).toEqual(action);
        });
      });
    });
  });
});
