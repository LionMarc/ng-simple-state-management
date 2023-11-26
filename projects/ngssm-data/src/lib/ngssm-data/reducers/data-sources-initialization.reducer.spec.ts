import { State } from 'ngssm-store';

import { DataSourcesInitializationReducer } from './data-sources-initialization.reducer';
import { NgssmDataActionType, NgssmInitDataSourceValuesAction } from '../actions';
import { NgssmDataStateSpecification, selectNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

describe('DataSourcesInitializationReducer', () => {
  let reducer: DataSourcesInitializationReducer;
  let state: State;

  beforeEach(() => {
    reducer = new DataSourcesInitializationReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  [NgssmDataActionType.initDataSourceValues].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmDataActionType.initDataSourceValues}'`, () => {
    it(`should add in dataSources state property a property for each key set in action`, () => {
      const action = new NgssmInitDataSourceValuesAction(['data-providers', 'team-managers']);

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
  });
});
