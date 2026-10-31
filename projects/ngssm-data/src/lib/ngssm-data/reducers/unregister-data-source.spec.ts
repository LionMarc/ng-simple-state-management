import { NgssmUnregisterDataSourceAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { unregisterDataSource } from './unregister-data-source';

describe('unregisterDataSource', () => {
  it('should remove the source and its value', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSources: { source: { $set: { key: 'source', dataLoadingFunc: () => ({}) } } },
        dataSourceValues: {
          source: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } }
        }
      }
    );

    const updatedState = unregisterDataSource(state, new NgssmUnregisterDataSourceAction('source'));
    const dataState = selectNgssmDataState(updatedState);
    expect(dataState.dataSources['source']).toBeUndefined();
    expect(dataState.dataSourceValues['source']).toBeUndefined();
  });
});
