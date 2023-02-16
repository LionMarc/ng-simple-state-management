import { DeleteNgssmTreeAction, NgssmTreeActionType } from '../actions';
import { NgssmTreeStateSpecification, selectNgssmTreeState, updateNgssmTreeState } from '../state';
import { TreesReducer } from './trees.reducer';

describe('TreesReducer', () => {
  let reducer: TreesReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreesReducer();
    state = {
      [NgssmTreeStateSpecification.featureStateKey]: NgssmTreeStateSpecification.initialState
    };
  });

  [NgssmTreeActionType.initNgssmTree, NgssmTreeActionType.deleteNgssmTree].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmTreeActionType.deleteNgssmTree}'`, () => {
    it(`should remove the tree from the state`, () => {
      state = updateNgssmTreeState(state, {
        trees: {
          testing: { $set: { type: 'Testing', nodes: [] } },
          demo: { $set: { type: 'Demo', nodes: [] } }
        }
      });

      const action = new DeleteNgssmTreeAction('testing');

      const updatedState = reducer.updateState(state, action);

      expect(Object.keys(selectNgssmTreeState(updatedState).trees)).toEqual(['demo']);
    });
  });
});
