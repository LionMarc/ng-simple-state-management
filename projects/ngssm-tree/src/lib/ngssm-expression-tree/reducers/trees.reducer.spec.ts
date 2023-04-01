import { NgssmClearExpressionTreeAction, NgssmExpressionTreeActionType, NgssmInitExpressionTreeAction } from '../actions';
import { NgssmNode } from '../model';
import { NgssmExpressionTreeStateSpecification, selectNgssmExpressionTreeState, updateNgssmExpressionTreeState } from '../state';
import { TreesReducer } from './trees.reducer';

describe('TreesReducer', () => {
  let reducer: TreesReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreesReducer();
    state = {
      [NgssmExpressionTreeStateSpecification.featureStateKey]: NgssmExpressionTreeStateSpecification.initialState
    };
  });

  [NgssmExpressionTreeActionType.ngssmInitExpressionTree, NgssmExpressionTreeActionType.ngssmClearExpressionTree].forEach(
    (actionType: string) => {
      it(`should process action of type '${actionType}'`, () => {
        expect(reducer.processedActions).toContain(actionType);
      });
    }
  );

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmInitExpressionTree}'`, () => {
    it(`should add the tree into the state`, () => {
      const treeId = 'demoTree';
      const action = new NgssmInitExpressionTreeAction(treeId, []);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId]).not.toBeNull();
    });

    it(`should set the path for all nodes`, () => {
      const treeId = 'demoTree';
      const nodes: NgssmNode[] = [
        {
          id: '1',
          data: {}
        },
        {
          id: '2',
          parentId: '1',
          data: {}
        },
        {
          id: '3',
          parentId: '1',
          data: {}
        },
        {
          id: '4',
          parentId: '3',
          data: {}
        },
        {
          id: '5',
          parentId: '1',
          data: {}
        }
      ];
      const action = new NgssmInitExpressionTreeAction(treeId, nodes);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.path)).toEqual([
        [],
        ['1'],
        ['1'],
        ['1', '3'],
        ['1']
      ]);
    });
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmClearExpressionTree}'`, () => {
    it(`shoudl remove the tree from the state`, () => {
      const treeId = 'demoTree';
      state = updateNgssmExpressionTreeState(state, {
        trees: {
          [treeId]: { $set: { nodes: [] } }
        }
      });

      const action = new NgssmClearExpressionTreeAction(treeId);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId]).toBeUndefined();
    });
  });
});
