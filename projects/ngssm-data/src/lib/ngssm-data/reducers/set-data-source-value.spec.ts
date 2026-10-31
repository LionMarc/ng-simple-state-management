import { HttpErrorResponse } from '@angular/common/http';

import { NgssmSetDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { setDataSourceValue } from './set-data-source-value';

describe('setDataSourceValue', () => {
  it('should set value, status, timestamp, and error for a registered source', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: { source: { $set: { status: NgssmDataSourceValueStatus.loading, additionalProperties: {} } } }
      }
    );
    const error = { message: 'failed' } as HttpErrorResponse;

    const updatedState = setDataSourceValue(
      state,
      new NgssmSetDataSourceValueAction('source', NgssmDataSourceValueStatus.error, ['value'], error)
    );

    const value = selectNgssmDataState(updatedState).dataSourceValues['source'];
    expect(value?.status).toBe(NgssmDataSourceValueStatus.error);
    expect(value?.value).toEqual(['value']);
    expect(value?.lastLoadingDate).toBeDefined();
    expect(value?.httpErrorResponse).toBe(error);
  });

  it('should leave state unchanged if the source value is not registered', () => {
    const state = { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState };
    expect(setDataSourceValue(state, new NgssmSetDataSourceValueAction('missing', NgssmDataSourceValueStatus.loaded))).toBe(state);
  });
});
