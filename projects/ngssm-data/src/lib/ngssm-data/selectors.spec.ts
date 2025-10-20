import { State } from 'ngssm-store';

import { NgssmDataStateSpecification, updateNgssmDataState } from './state';
import { isNgssmDataSourceLoading, isNgssmDataSourceParameterValid } from './selectors';
import { NgssmDataSourceValueStatus } from './model';

describe('selectors', () => {
  let state: State;

  beforeEach(() => {
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  describe('isNgssmDataSourceLoading', () => {
    [
      NgssmDataSourceValueStatus.error,
      NgssmDataSourceValueStatus.loaded,
      NgssmDataSourceValueStatus.none,
      NgssmDataSourceValueStatus.notRegistered
    ].forEach((status) => {
      it(`should return false when data source status is '${status}'`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            'my-source': {
              $set: {
                status,
                additionalProperties: {}
              }
            }
          }
        });

        const result = isNgssmDataSourceLoading(state, 'my-source');
        expect(result).toBeFalse();
      });
    });

    [NgssmDataSourceValueStatus.loading].forEach((status) => {
      it(`should return true when data source status is '${status}'`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            'my-source': {
              $set: {
                status,
                additionalProperties: {}
              }
            }
          }
        });

        const result = isNgssmDataSourceLoading(state, 'my-source');
        expect(result).toBeTrue();
      });
    });
  });

  describe('isNgssmDataSourceParameterValid', () => {
    it(`should consider a parameter valid by default when no validity info is present`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          'my-source': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {}
            }
          }
        }
      });

      const result = isNgssmDataSourceParameterValid(state, 'my-source');
      expect(result).toBeTrue();
    });

    [true, false].forEach((isValid) => {
      it(`should return ${isValid} when parameterIsValid is set to ${isValid}`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            'my-source': {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                additionalProperties: {},
                parameterIsValid: isValid
              }
            }
          }
        });

        const result = isNgssmDataSourceParameterValid(state, 'my-source');
        expect(result).toEqual(isValid);
      });
    });

    it(`should return true when parameterIsValid is not set and all partial are true`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          'my-source': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {},
              parameterPartialValidity: {
                second: true,
                third: true
              }
            }
          }
        }
      });

      const result = isNgssmDataSourceParameterValid(state, 'my-source');
      expect(result).toBeTrue();
    });

    it(`should return false when parameterIsValid is not set and at least one partial is false`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          'my-source': {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {},
              parameterPartialValidity: {
                second: true,
                third: true,
                fourth: false
              }
            }
          }
        }
      });

      const result = isNgssmDataSourceParameterValid(state, 'my-source');
      expect(result).toBeFalse();
    });
  });
});
