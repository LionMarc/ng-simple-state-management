import { NgssmUpdateDataSourceParameterWithFunctionAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { updateDataSourceParameterWithFunction } from './update-data-source-parameter-with-function';

describe('updateDataSourceParameterWithFunction', () => {
  it('should use the current parameter to update parameter and outdated status', () => {
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
      updateDataSourceParameterWithFunction(
        state,
        new NgssmUpdateDataSourceParameterWithFunctionAction('source', (parameter) => ({
          ...(parameter as Record<string, number>),
          second: 2
        }))
      )
    ).dataSourceValues['source'];
    expect(value?.parameter).toEqual({ first: 1, second: 2 });
    expect(value?.valueOutdated).toBe(true);
  });
});
