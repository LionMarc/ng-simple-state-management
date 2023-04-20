import { State } from 'ngssm-store';

import { RemoteCallConfig, RemoteCallStatus } from '../model';
import { NgssmRemoteCallStateSpecification, selectNgssmRemoteCallState, updateNgssmRemoteCallState } from '../state';
import { RemoteCallReducer } from './remote-call.reducer';

describe('RemoteCallReducer', () => {
  let reducer: RemoteCallReducer;
  let state: State;
  const configs: RemoteCallConfig[] = [
    {
      id: 'test1',
      triggeredActionTypes: ['trigger1'],
      resultActionTypes: ['result1']
    }
  ];

  beforeEach(() => {
    reducer = new RemoteCallReducer(configs);
    state = {
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
    };
  });

  ['trigger1', 'result1'].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing a triggered action`, () => {
    beforeEach(() => {
      state = updateNgssmRemoteCallState(state, {
        remoteCalls: {
          ['test1']: {
            $set: {
              status: RemoteCallStatus.ko,
              error: {
                title: 'Bad data'
              },
              message: 'unexpected'
            }
          }
        }
      });
    });

    it(`should set status to '${RemoteCallStatus.inProgress}'`, () => {
      const updatedState = reducer.updateState(state, { type: 'trigger1' });

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['test1'].status).toEqual(RemoteCallStatus.inProgress);
    });

    it(`should reset the error to undefined`, () => {
      const updatedState = reducer.updateState(state, { type: 'trigger1' });

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['test1'].error).toEqual(undefined);
    });

    it(`should reset the message to undefined`, () => {
      const updatedState = reducer.updateState(state, { type: 'trigger1' });

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['test1'].message).toEqual(undefined);
    });
  });
});
