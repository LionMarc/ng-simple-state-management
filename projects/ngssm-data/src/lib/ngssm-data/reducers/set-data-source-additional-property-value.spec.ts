import { HttpErrorResponse } from '@angular/common/http';

import { NgssmSetDataSourceAdditionalPropertyValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { setDataSourceAdditionalPropertyValue } from './set-data-source-additional-property-value';

describe('setDataSourceAdditionalPropertyValue', () => {
  it('should set the property value, status, timestamp, and error', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: { $set: { status: NgssmDataSourceValueStatus.loading, additionalProperties: {} } }
        }
      }
    );
    const error = { message: 'failed' } as HttpErrorResponse;
    const updatedState = setDataSourceAdditionalPropertyValue(
      state,
      new NgssmSetDataSourceAdditionalPropertyValueAction(
        'source',
        'detail',
        NgssmDataSourceValueStatus.error,
        { label: 'value' },
        undefined,
        error
      )
    );

    const property = selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail'];
    expect(property?.status).toBe(NgssmDataSourceValueStatus.error);
    expect(property?.value).toEqual({ label: 'value' });
    expect(property?.lastLoadingDate).toBeDefined();
    expect(property?.httpErrorResponse).toBe(error);
  });

  it('should update the value of an existing property', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: { detail: { status: NgssmDataSourceValueStatus.loaded, value: { label: 'old' } } }
            }
          }
        }
      }
    );
    const updatedState = setDataSourceAdditionalPropertyValue(
      state,
      new NgssmSetDataSourceAdditionalPropertyValueAction('source', 'detail', NgssmDataSourceValueStatus.loaded, { label: 'new' })
    );

    expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']?.value).toEqual({ label: 'new' });
  });

  it('should set the error response', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: { detail: { status: NgssmDataSourceValueStatus.loaded } }
            }
          }
        }
      }
    );
    const error = { message: 'failed' } as HttpErrorResponse;
    const updatedState = setDataSourceAdditionalPropertyValue(
      state,
      new NgssmSetDataSourceAdditionalPropertyValueAction('source', 'detail', NgssmDataSourceValueStatus.error, undefined, undefined, error)
    );

    expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']?.httpErrorResponse).toBe(error);
  });
});
