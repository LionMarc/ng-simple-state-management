import { NgssmUpdateDataSourceParameterAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { updateDataSourceParameter } from './update-data-source-parameter';

describe('updateDataSourceParameter', () => {
  it('should merge the parameter and mark the value outdated', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameter: { first: 1, second: 2 },
              additionalProperties: {},
              valueOutdated: false
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(updateDataSourceParameter(state, new NgssmUpdateDataSourceParameterAction('source', { second: 3 })))
      .dataSourceValues['source'];
    expect(value?.parameter).toEqual({ first: 1, second: 3 });
    expect(value?.valueOutdated).toBe(true);
  });

  it('should not mark the value outdated when requested', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameter: { first: 1 },
              additionalProperties: {},
              valueOutdated: false
            }
          }
        }
      }
    );

    const value = selectNgssmDataState(
      updateDataSourceParameter(state, new NgssmUpdateDataSourceParameterAction('source', { second: 2 }, true))
    ).dataSourceValues['source'];
    expect(value?.parameter).toEqual({ first: 1, second: 2 });
    expect(value?.valueOutdated).toBe(false);
  });

  it('should preserve partial validity while merging the parameter', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              parameter: { first: 1 },
              parameterPartialValidity: { field: true },
              additionalProperties: {}
            }
          }
        }
      }
    );

    const updatedState = updateDataSourceParameter(state, new NgssmUpdateDataSourceParameterAction('source', { second: 2 }));
    const value = selectNgssmDataState(updatedState).dataSourceValues['source'];
    expect(value?.parameterPartialValidity).toEqual({ field: true });
  });
});
