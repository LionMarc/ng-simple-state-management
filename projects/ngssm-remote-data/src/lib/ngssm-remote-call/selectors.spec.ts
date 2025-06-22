import { State } from 'ngssm-store';

import { isNgssmRemoteCallInProgress } from './selectors';
import { RemoteCallStatus } from './remote-call';
import { NgssmRemoteCallStateSpecification, updateNgssmRemoteCallState } from './ngssm-remote-call.state';

describe('selectors', () => {
  describe('isNgssmRemoteCallInProgress', () => {
    [RemoteCallStatus.done, RemoteCallStatus.failed, RemoteCallStatus.none].forEach((status) => {
      it(`should return false when remote call status is '${status}'`, () => {
        let state: State = {
          [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
        };
        state = updateNgssmRemoteCallState(state, {
          remoteCalls: {
            'my-call': {
              $set: {
                status
              }
            }
          }
        });

        const result = isNgssmRemoteCallInProgress(state, 'my-call');
        expect(result).toBeFalse();
      });
    });

    [RemoteCallStatus.inProgress].forEach((status) => {
      it(`should return true when remote call status is '${status}'`, () => {
        let state: State = {
          [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
        };
        state = updateNgssmRemoteCallState(state, {
          remoteCalls: {
            'my-call': {
              $set: {
                status
              }
            }
          }
        });

        const result = isNgssmRemoteCallInProgress(state, 'my-call');
        expect(result).toBeTrue();
      });
    });
  });
});
