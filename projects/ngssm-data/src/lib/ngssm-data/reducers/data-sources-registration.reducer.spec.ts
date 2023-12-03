import { of } from 'rxjs';

import { State } from 'ngssm-store';

import { NgssmDataActionType, NgssmRegisterDataSourcesAction } from '../actions';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';
import { DataSourcesRegistrationReducer } from './data-sources-registration.reducer';

describe('DataSourcesRegistrationReducer', () => {
  let reducer: DataSourcesRegistrationReducer;
  let state: State;

  beforeEach(() => {
    reducer = new DataSourcesRegistrationReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  [NgssmDataActionType.registerDataSources].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmDataActionType.registerDataSources}'`, () => {
    it(`should add in dataSources state property a property for each key set in action`, () => {
      const action = new NgssmRegisterDataSourcesAction([
        {
          key: 'data-providers',
          dataLoadingFunc: () => of([])
        },
        {
          key: 'team-managers',
          dataLoadingFunc: () => of([])
        }
      ]);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.none
        },
        'team-managers': {
          status: NgssmDataSourceValueStatus.none
        }
      });
    });

    it(`should store in state the lifetime if set in action`, () => {
      const action = new NgssmRegisterDataSourcesAction([
        {
          key: 'data-providers',
          dataLifetimeInSeconds: 60,
          dataLoadingFunc: () => of([])
        }
      ]);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.none,
          dataLifetimeInSeconds: 60
        }
      });
    });

    it(`should not modify the value for a source already registered`, () => {
      state = updateNgssmDataState(state, {
        dataSources: {
          ['data-providers']: {
            $set: {
              key: 'data-providers',
              dataLoadingFunc: () => of([])
            }
          }
        },
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: ['pr1']
            }
          }
        }
      });

      const action = new NgssmRegisterDataSourcesAction([
        {
          key: 'data-providers',
          dataLoadingFunc: () => of([])
        },
        {
          key: 'team-managers',
          dataLoadingFunc: () => of([])
        }
      ]);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.loaded,
          value: ['pr1']
        },
        'team-managers': {
          status: NgssmDataSourceValueStatus.none
        }
      });
    });
  });
});
