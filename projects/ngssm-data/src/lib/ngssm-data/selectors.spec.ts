import { State } from 'ngssm-store';

import { NgssmDataStateSpecification, updateNgssmDataState } from './state';
import { isNgssmDataSourceLoading } from './selectors';
import { NgssmDataSourceValueStatus } from './model';

describe('selectors', () => {
  describe('isNgssmDataSourceLoading', () => {
    [
      NgssmDataSourceValueStatus.error,
      NgssmDataSourceValueStatus.loaded,
      NgssmDataSourceValueStatus.none,
      NgssmDataSourceValueStatus.notRegistered
    ].forEach((status) => {
      it(`should return false when data source status is '${status}'`, () => {
        let state: State = {
          [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
        };
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
        let state: State = {
          [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
        };
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
});
