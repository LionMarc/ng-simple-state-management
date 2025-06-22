import { State } from 'ngssm-store';

import { NgssmRemoteCallActionType, SetRemoteCallAction } from '../actions';
import { RemoteCallSetterReducer } from './remote-call-setter.reducer';
import { NgssmRemoteCallStateSpecification, selectNgssmRemoteCallState, updateNgssmRemoteCallState } from '../ngssm-remote-call.state';
import { RemoteCallStatus } from '../remote-call';

describe('RemoteCallSetterReducer', () => {
  let reducer: RemoteCallSetterReducer;
  let state: State;

  beforeEach(() => {
    reducer = new RemoteCallSetterReducer();
    state = {
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
    };
  });

  [NgssmRemoteCallActionType.setRemoteCall].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmRemoteCallActionType.setRemoteCall}'`, () => {
    it(`should add the call id when it does not exist`, () => {
      const action = new SetRemoteCallAction('testing', { status: RemoteCallStatus.inProgress });
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['testing']).toEqual({ status: RemoteCallStatus.inProgress });
    });

    it(`should update the remote call value when the call id exists`, () => {
      state = updateNgssmRemoteCallState(state, {
        remoteCalls: {
          ['testing']: {
            $set: {
              status: RemoteCallStatus.ko
            }
          }
        }
      });
      const action = new SetRemoteCallAction('testing', { status: RemoteCallStatus.inProgress });
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['testing']).toEqual({ status: RemoteCallStatus.inProgress });
    });
  });
});
