import { State } from 'ngssm-store';
import { NgssmTreeActionType } from '../actions';
import { TreeNodesReducer } from './tree-nodes.reducer';

describe('TreeNodesReducer', () => {
  let reducer: TreeNodesReducer;
  let state: State;

  beforeEach(() => {
    reducer = new TreeNodesReducer();
    state = {};
  });

  [NgssmTreeActionType.registerNodes].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
