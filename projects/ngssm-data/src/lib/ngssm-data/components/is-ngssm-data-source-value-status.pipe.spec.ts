import { State } from 'ngssm-store';

import { IsNgssmDataSourceValueStatusPipe } from './is-ngssm-data-source-value-status.pipe';
import { NgssmDataStateSpecification, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

describe('IsNgssmDataSourceValueStatusPipe', () => {
  let state: State;
  let pipe: IsNgssmDataSourceValueStatusPipe;

  beforeEach(() => {
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
    pipe = new IsNgssmDataSourceValueStatusPipe();
  });

  describe(`when data souce is not registered`, () => {
    [
      NgssmDataSourceValueStatus.error,
      NgssmDataSourceValueStatus.loaded,
      NgssmDataSourceValueStatus.loading,
      NgssmDataSourceValueStatus.none
    ].forEach((status) => {
      it(`should return false when checking if source value status is '${status}'`, () => {
        const result = pipe.transform(state, 'unknown_source', status);
        expect(result).toBeFalse();
      });
    });

    it(`should return true when checking if source value status is '${NgssmDataSourceValueStatus.notRegistered}'`, () => {
      const result = pipe.transform(state, 'unknown_source', NgssmDataSourceValueStatus.notRegistered);
      expect(result).toBeTrue();
    });
  });

  describe(`when data source is registered and status is '${NgssmDataSourceValueStatus.loading}'`, () => {
    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['my-source']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading
            }
          }
        }
      });
    });

    [
      NgssmDataSourceValueStatus.error,
      NgssmDataSourceValueStatus.loaded,
      NgssmDataSourceValueStatus.notRegistered,
      NgssmDataSourceValueStatus.none
    ].forEach((status) => {
      it(`should return false when checking if source value status is '${status}'`, () => {
        const result = pipe.transform(state, 'my-source', status);
        expect(result).toBeFalse();
      });
    });

    it(`should return true when checking if source value status is '${NgssmDataSourceValueStatus.loading}'`, () => {
      const result = pipe.transform(state, 'my-source', NgssmDataSourceValueStatus.loading);
      expect(result).toBeTrue();
    });

    it(`should return true when checking if source value status is one of '${NgssmDataSourceValueStatus.loading}, ${NgssmDataSourceValueStatus.loaded}'`, () => {
      const result = pipe.transform(state, 'my-source', NgssmDataSourceValueStatus.loaded, NgssmDataSourceValueStatus.loading);
      expect(result).toBeTrue();
    });
  });
});
