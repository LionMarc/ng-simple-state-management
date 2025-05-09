import { of } from 'rxjs';

import { State } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmRegisterDataSourceAction,
  NgssmRegisterDataSourcesAction,
  NgssmUnregisterDataSourceAction
} from '../actions';
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

  [NgssmDataActionType.registerDataSources, NgssmDataActionType.registerDataSource, NgssmDataActionType.unregisterDataSource].forEach(
    (actionType: string) => {
      it(`should process action of type '${actionType}'`, () => {
        expect(reducer.processedActions).toContain(actionType);
      });
    }
  );

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
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {}
        },
        'team-managers': {
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {}
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
          dataLifetimeInSeconds: 60,
          additionalProperties: {}
        }
      });
    });

    it(`should store in state the parameter if set in action`, () => {
      const action = new NgssmRegisterDataSourcesAction([
        {
          key: 'data-providers',
          dataLoadingFunc: () => of([]),
          initialParameter: {
            label: 'testing'
          }
        }
      ]);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {},
          parameter: {
            label: 'testing'
          }
        }
      });
    });

    it(`should store in state the parameter validity if set in action`, () => {
      const action = new NgssmRegisterDataSourcesAction([
        {
          key: 'data-providers',
          dataLoadingFunc: () => of([]),
          initialParameter: {
            label: 'testing'
          },
          initialParameterInvalid: true
        }
      ]);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {},
          parameter: {
            label: 'testing'
          },
          parameterIsValid: false
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
              value: ['pr1'],
              additionalProperties: {}
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
          value: ['pr1'],
          additionalProperties: {}
        },
        'team-managers': {
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {}
        }
      });
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.registerDataSource}'`, () => {
    beforeEach(() => {
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
              value: ['pr1'],
              additionalProperties: {}
            }
          }
        }
      });
    });

    it(`should add in dataSources state property a property for the new data source`, () => {
      const action = new NgssmRegisterDataSourceAction({
        key: 'uploaded-files',
        dataLoadingFunc: () => of([])
      });

      const updatedState = reducer.updateState(state, action);

      expect(Object.keys(selectNgssmDataState(updatedState).dataSources)).toEqual(['data-providers', 'uploaded-files']);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.loaded,
          additionalProperties: {},
          value: ['pr1']
        },
        'uploaded-files': {
          status: NgssmDataSourceValueStatus.none,
          additionalProperties: {}
        }
      });
    });

    it(`should store in state the lifetime if set in action`, () => {
      const action = new NgssmRegisterDataSourceAction({
        key: 'uploaded-files',
        dataLifetimeInSeconds: 60,
        dataLoadingFunc: () => of([])
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues).toEqual({
        'data-providers': {
          status: NgssmDataSourceValueStatus.loaded,
          additionalProperties: {},
          value: ['pr1']
        },
        'uploaded-files': {
          status: NgssmDataSourceValueStatus.none,
          dataLifetimeInSeconds: 60,
          additionalProperties: {}
        }
      });
    });

    it(`should store in state the linked source if set in action`, () => {
      const action = new NgssmRegisterDataSourceAction({
        key: 'uploaded-files',
        linkedToDataSource: 'another-one',
        dataLoadingFunc: () => of([])
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSources['uploaded-files'].linkedToDataSource).toEqual('another-one');
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.unregisterDataSource}'`, () => {
    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSources: {
          ['data-providers']: {
            $set: {
              key: 'data-providers',
              dataLoadingFunc: () => of([])
            }
          },
          ['uploaded-files']: {
            $set: {
              key: 'uploaded-files',
              dataLoadingFunc: () => of([])
            }
          }
        },
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: ['pr1'],
              additionalProperties: {}
            }
          },
          ['uploaded-files']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: ['u1', 'u2'],
              additionalProperties: {}
            }
          }
        }
      });
    });

    it(`should remove from the dataSources state property the source to unregister`, () => {
      const action = new NgssmUnregisterDataSourceAction('data-providers');

      const updatedState = reducer.updateState(state, action);

      expect(Object.keys(selectNgssmDataState(updatedState).dataSources)).toEqual(['uploaded-files']);
    });

    it(`should remove from the dataSourceValues state property the source to unregister`, () => {
      const action = new NgssmUnregisterDataSourceAction('data-providers');

      const updatedState = reducer.updateState(state, action);

      expect(Object.keys(selectNgssmDataState(updatedState).dataSourceValues)).toEqual(['uploaded-files']);
    });
  });
});
