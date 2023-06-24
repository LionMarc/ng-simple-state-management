import { State } from 'ngssm-store';

import { RemoteDataStateSpecification, updateRemoteDataState } from '../remote-data/state';
import { NgssmRemoteCallStateSpecification, updateNgssmRemoteCallState } from '../ngssm-remote-call/state';
import { atLeastOneLoadingOrInProgress } from './at-least-one-loading-or-in-progress';
import { DataStatus } from '../remote-data/model';
import { RemoteCallStatus } from '../ngssm-remote-call/model';

describe('atLeastOneLoadingOrInProgress', () => {
  let state: State;

  beforeEach(() => {
    state = {
      [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState,
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
    };
  });

  it(`should return false when no remote data key nor remote call id is set`, () => {
    const result = atLeastOneLoadingOrInProgress(state, [], []);

    expect(result).toBeFalse();
  });

  describe(`with some remote data with loading status`, () => {
    beforeEach(() => {
      state = updateRemoteDataState(state, {
        ['testing1']: {
          $set: {
            status: DataStatus.loading
          }
        },
        ['testing2']: {
          $set: {
            status: DataStatus.loaded
          }
        },
        ['testing3']: {
          $set: {
            status: DataStatus.loading
          }
        }
      });
    });

    it(`should return false when no remote data key nor remote call id is set`, () => {
      const result = atLeastOneLoadingOrInProgress(state, [], []);

      expect(result).toBeFalse();
    });

    it(`should return false when testing a wrong remote data key`, () => {
      const result = atLeastOneLoadingOrInProgress(state, ['wrong'], []);

      expect(result).toBeFalse();
    });

    it(`should return false when testing a remote data key  not in loading status`, () => {
      const result = atLeastOneLoadingOrInProgress(state, ['testing2'], []);

      expect(result).toBeFalse();
    });

    it(`should return true when one checked remote data key is in loading status`, () => {
      const result = atLeastOneLoadingOrInProgress(state, ['testing2', 'testing3'], []);

      expect(result).toBeTrue();
    });
  });

  describe(`with some remote calls in progress`, () => {
    beforeEach(() => {
      state = updateNgssmRemoteCallState(state, {
        remoteCalls: {
          ['testing1']: {
            $set: {
              status: RemoteCallStatus.inProgress
            }
          },
          ['testing2']: {
            $set: {
              status: RemoteCallStatus.done
            }
          },
          ['testing3']: {
            $set: {
              status: RemoteCallStatus.inProgress
            }
          }
        }
      });
    });

    it(`should return false when no remote data key nor remote call id is set`, () => {
      const result = atLeastOneLoadingOrInProgress(state, [], []);

      expect(result).toBeFalse();
    });

    it(`should return false when checking a wrong remote call id`, () => {
      const result = atLeastOneLoadingOrInProgress(state, [], ['wrong']);

      expect(result).toBeFalse();
    });

    it(`should return false when checking a remote call id not in progress`, () => {
      const result = atLeastOneLoadingOrInProgress(state, [], ['testing2']);

      expect(result).toBeFalse();
    });

    it(`should return true when one checked remote call id is in progress`, () => {
      const result = atLeastOneLoadingOrInProgress(state, [], ['testing2', 'testing3']);

      expect(result).toBeTrue();
    });
  });
});
