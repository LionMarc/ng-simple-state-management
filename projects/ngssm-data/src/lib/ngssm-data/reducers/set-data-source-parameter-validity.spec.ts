import { NgssmSetDataSourceParameterValidityAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { setDataSourceParameterValidity } from './set-data-source-parameter-validity';

describe('setDataSourceParameterValidity', () => {
  it('should set global validity and optionally clear partial validity', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameterIsValid: true,
              parameterPartialValidity: { field: true },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(
      setDataSourceParameterValidity(state, new NgssmSetDataSourceParameterValidityAction('source', false, undefined, true))
    ).dataSourceValues['source'];
    expect(value?.parameterIsValid).toBe(false);
    expect(value?.parameterPartialValidity).toBeUndefined();
  });

  it('should update partial validity without changing global validity', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameterIsValid: true,
              parameterPartialValidity: { field: true },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(
      setDataSourceParameterValidity(state, new NgssmSetDataSourceParameterValidityAction('source', false, 'field'))
    ).dataSourceValues['source'];
    expect(value?.parameterIsValid).toBe(true);
    expect(value?.parameterPartialValidity).toEqual({ field: false });
  });

  it('should create partial validity when none exists', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } }
        }
      }
    );

    const value = selectNgssmDataState(
      setDataSourceParameterValidity(state, new NgssmSetDataSourceParameterValidityAction('source', false, 'field'))
    ).dataSourceValues['source'];
    expect(value?.parameterPartialValidity).toEqual({ field: false });
    expect(value?.parameterIsValid).toBeUndefined();
  });

  it('should clear all partial validity when requested', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameterPartialValidity: { first: true, second: false },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(
      setDataSourceParameterValidity(state, new NgssmSetDataSourceParameterValidityAction('source', false, undefined, true))
    ).dataSourceValues['source'];
    expect(value?.parameterIsValid).toBe(false);
    expect(value?.parameterPartialValidity).toBeUndefined();
  });
});
