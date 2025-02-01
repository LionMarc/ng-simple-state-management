import { State } from 'ngssm-store';
import { NgssmTreeActionType } from '../actions';
import { TreeNodesSearchReducer } from './tree-nodes-search.reducer';

describe('TreeNodesSearchReducer', () => {
  let reducer: TreeNodesSearchReducer;
  let state: State;

  beforeEach(() => {
    reducer = new TreeNodesSearchReducer();
    state = {};
  });

  [
    NgssmTreeActionType.displaySearchDialog,
    NgssmTreeActionType.closeSearchDialog,
    NgssmTreeActionType.searchTreeNodes,
    NgssmTreeActionType.registerPartialSearchResults,
    NgssmTreeActionType.abortTreeNodesSearch
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
