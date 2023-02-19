import { RemoteCallConfig } from '../model';
import { RemoteCallReducer } from './remote-call.reducer';

describe('RemoteCallReducer', () => {
  let reducer: RemoteCallReducer;
  let state: { [key: string]: any };
  const configs: RemoteCallConfig[] = [
    {
      id: 'test1',
      triggeredActionType: 'trigger1',
      resultActionType: 'result1'
    }
  ];

  beforeEach(() => {
    reducer = new RemoteCallReducer(configs);
    state = {};
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
