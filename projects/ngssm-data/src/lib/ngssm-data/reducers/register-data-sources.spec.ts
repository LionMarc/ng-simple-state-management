import { of } from 'rxjs';

import { NgssmRegisterDataSourcesAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState } from '../state';
import { registerDataSources } from './register-data-sources';

describe('registerDataSources', () => {
  it('should register sources with their initial values and keep existing sources unchanged', () => {
    const state = {
      [NgssmDataStateSpecification.featureStateKey]: {
        ...NgssmDataStateSpecification.initialState,
        dataSources: {
          existing: { key: 'existing', dataLoadingFunc: () => of([]) }
        },
        dataSourceValues: {
          existing: { status: NgssmDataSourceValueStatus.loaded, value: ['kept'], additionalProperties: {} }
        }
      }
    };

    const updatedState = registerDataSources(
      state,
      new NgssmRegisterDataSourcesAction([
        { key: 'existing', dataLoadingFunc: () => of([]) },
        {
          key: 'new',
          dataLoadingFunc: () => of([]),
          dataLifetimeInSeconds: 60,
          initialParameter: 'initial',
          initialParameterInvalid: true
        }
      ])
    );

    const dataState = selectNgssmDataState(updatedState);
    expect(dataState.dataSourceValues['existing']?.value).toEqual(['kept']);
    expect(dataState.dataSourceValues['new']).toEqual({
      status: NgssmDataSourceValueStatus.none,
      additionalProperties: {},
      dataLifetimeInSeconds: 60,
      parameter: 'initial',
      parameterIsValid: false
    });
    expect(dataState.dataSources['new']?.key).toBe('new');
  });
});
