import { of } from 'rxjs';

import { NgssmRegisterDataSourceAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState } from '../state';
import { registerDataSource } from './register-data-source';

describe('registerDataSource', () => {
  it('should register a single data source with its loading configuration', () => {
    const state = { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState };
    const updatedState = registerDataSource(
      state,
      new NgssmRegisterDataSourceAction({
        key: 'source',
        dataLoadingFunc: () => of([]),
        dataLifetimeInSeconds: 60,
        initialParameter: { label: 'initial' },
        linkedToDataSource: 'upstream'
      })
    );

    const dataState = selectNgssmDataState(updatedState);
    expect(dataState.dataSources['source']?.key).toBe('source');
    expect(dataState.dataSources['source']?.linkedToDataSource).toBe('upstream');
    expect(dataState.dataSourceValues['source']).toEqual({
      status: NgssmDataSourceValueStatus.none,
      additionalProperties: {},
      dataLifetimeInSeconds: 60,
      parameter: { label: 'initial' }
    });
  });
});
