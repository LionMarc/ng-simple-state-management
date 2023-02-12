import { NgssmTreeActionType } from '../actions';
import { TreeNodeExpandReducer } from './tree-node-expand.reducer';

describe('TreeNodeExpandReducer', () => {
  let reducer: TreeNodeExpandReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreeNodeExpandReducer();
    state = {};
  });

  [NgssmTreeActionType.expandNode, NgssmTreeActionType.collapseNode].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
