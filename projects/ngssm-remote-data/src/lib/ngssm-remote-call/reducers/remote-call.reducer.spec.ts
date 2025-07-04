import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { State } from 'ngssm-store';

import { RemoteCallReducer } from './remote-call.reducer';
import { NGSSM_REMOTE_CALL_CONFIG, RemoteCallConfig } from '../register-remote-call';
import { NgssmRemoteCallStateSpecification, selectNgssmRemoteCallState, updateNgssmRemoteCallState } from '../ngssm-remote-call.state';
import { RemoteCallStatus } from '../remote-call';

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
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NGSSM_REMOTE_CALL_CONFIG,
          useValue: configs[0],
          multi: true
        },
        RemoteCallReducer
      ]
    });
    reducer = TestBed.inject(RemoteCallReducer);
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
              httpErrorResponse: {
                message: 'Bad data'
              } as unknown as HttpErrorResponse,
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

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['test1'].httpErrorResponse).toEqual(undefined);
    });

    it(`should reset the message to undefined`, () => {
      const updatedState = reducer.updateState(state, { type: 'trigger1' });

      expect(selectNgssmRemoteCallState(updatedState).remoteCalls['test1'].message).toEqual(undefined);
    });
  });
});
