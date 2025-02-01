import { State } from 'ngssm-store';
import { NgssmTreeActionType } from '../actions';
import { TreeNodeSelectionReducer } from './tree-node-selection.reducer';

describe('TreeNodeSelectionReducer', () => {
  let reducer: TreeNodeSelectionReducer;
  let state: State;

  beforeEach(() => {
    reducer = new TreeNodeSelectionReducer();
    state = {};
  });

  [NgssmTreeActionType.selectNode].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
