import { RemoteCallConfig } from '../model';
import { NgssmRemoteCallStateSpecification } from '../state';
import { RemoteCallReducer } from './remote-call.reducer';

describe('RemoteCallReducer', () => {
  let reducer: RemoteCallReducer;
  let state: { [key: string]: any };
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
});
