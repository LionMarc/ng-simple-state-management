import { NgssmTreeActionType } from '../actions';
import { TreesReducer } from './trees.reducer';

describe('TreesReducer', () => {
  let reducer: TreesReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreesReducer();
    state = {};
  });

  [NgssmTreeActionType.initNgssmTree].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
