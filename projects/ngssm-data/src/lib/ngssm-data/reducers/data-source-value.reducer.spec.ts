import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { DataSourceValueReducer } from './data-source-value.reducer';
import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../actions';
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
                status: status
              }
            },
            ['team-managers']: {
              $set: {
                status: NgssmDataSourceValueStatus.none
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

    describe(`when data source has defined a lifetime for the data`, () => {
      it(`should not update the data status when reload has not been forced and data are still valid`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                dataLifetimeInSeconds: 50,
                lastLoadingDate: DateTime.now().plus({ second: -30 })
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
                lastLoadingDate: DateTime.now().plus({ second: -30 })
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceValueAction('data-providers', true);

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
                lastLoadingDate: DateTime.now().plus({ second: -80 })
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
                dataLifetimeInSeconds: 50
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
});
