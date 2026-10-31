import { HttpErrorResponse } from '@angular/common/http';

import { NgssmClearDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { clearDataSourceValue } from './clear-data-source-value';

describe('clearDataSourceValue', () => {
  it('should clear the value and reset status while preserving the parameter by default', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              value: ['value'],
              parameter: 'parameter',
              parameterIsValid: true,
              parameterPartialValidity: { field: true },
              additionalProperties: { detail: { status: NgssmDataSourceValueStatus.loaded } }
            }
          }
        }
      }
    );

    const updatedState = clearDataSourceValue(state, new NgssmClearDataSourceValueAction('source'));
    const value = selectNgssmDataState(updatedState).dataSourceValues['source'];
    expect(value?.status).toBe(NgssmDataSourceValueStatus.none);
    expect(value?.value).toBeUndefined();
    expect(value?.lastLoadingDate).toBeUndefined();
    expect(value?.additionalProperties).toEqual({});
    expect(value?.parameter).toBe('parameter');
    expect(value?.parameterIsValid).toBe(true);
    expect(value?.parameterPartialValidity).toEqual({ field: true });
  });

  it('should clear parameter and validity when requested', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameter: 'parameter',
              parameterIsValid: true,
              parameterPartialValidity: { field: true },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(clearDataSourceValue(state, new NgssmClearDataSourceValueAction('source', true))).dataSourceValues[
      'source'
    ];
    expect(value?.parameter).toBeUndefined();
    expect(value?.parameterIsValid).toBeUndefined();
    expect(value?.parameterPartialValidity).toBeUndefined();
  });

  it('should clear a previous HTTP error', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.error,
              httpErrorResponse: new HttpErrorResponse({ status: 500 }),
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(clearDataSourceValue(state, new NgssmClearDataSourceValueAction('source'))).dataSourceValues[
      'source'
    ];
    expect(value?.httpErrorResponse).toBeUndefined();
  });
});
