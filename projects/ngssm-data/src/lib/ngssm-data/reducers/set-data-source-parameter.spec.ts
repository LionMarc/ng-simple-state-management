import { NgssmSetDataSourceParameterAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { setDataSourceParameter } from './set-data-source-parameter';

describe('setDataSourceParameter', () => {
  it('should set parameter and validity and mark the value outdated by default', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } }
        }
      }
    );

    const value = selectNgssmDataState(setDataSourceParameter(state, new NgssmSetDataSourceParameterAction('source', 'parameter', false)))
      .dataSourceValues['source'];
    expect(value?.parameter).toBe('parameter');
    expect(value?.parameterIsValid).toBe(false);
    expect(value?.valueOutdated).toBe(true);
  });

  it('should leave the value current when doNotMarkParameterAsModified is true', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: { source: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } } }
      }
    );

    const value = selectNgssmDataState(
      setDataSourceParameter(state, new NgssmSetDataSourceParameterAction('source', 'parameter', true, true))
    ).dataSourceValues['source'];
    expect(value?.valueOutdated).toBe(false);
  });

  it('should clear an unset parameter and preserve its partial validity', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameter: 'old',
              parameterPartialValidity: { field: true },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(setDataSourceParameter(state, new NgssmSetDataSourceParameterAction('source'))).dataSourceValues[
      'source'
    ];
    expect(value?.parameter).toBeUndefined();
    expect(value?.valueOutdated).toBe(true);
    expect(value?.parameterPartialValidity).toEqual({ field: true });
  });
});
