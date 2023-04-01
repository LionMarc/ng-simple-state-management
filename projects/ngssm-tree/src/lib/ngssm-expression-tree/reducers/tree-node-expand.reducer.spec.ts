import { NgssmCollapseExpressionTreeNodeAction, NgssmExpandExpressionTreeNodeAction, NgssmExpressionTreeActionType } from '../actions';
import { selectNgssmExpressionTreeState, updateNgssmExpressionTreeState } from '../state';
import { TreeNodeExpandReducer } from './tree-node-expand.reducer';

describe('TreeNodeExpandReducer', () => {
  let reducer: TreeNodeExpandReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreeNodeExpandReducer();
    state = {};
  });

  [NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode, NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode].forEach(
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

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmExpandExpressionTreeNode}'`, () => {
    it(`should set to true the isExpanded property of the node`, () => {
      const treeId = 'demoTree';
      state = updateNgssmExpressionTreeState(state, {
        trees: {
          [treeId]: {
            $set: {
              nodes: [
                {
                  isExpanded: false,
                  path: [],
                  data: {
                    isExpandable: true,
                    id: '54',
                    data: {}
                  }
                }
              ]
            }
          }
        }
      });

      const action = new NgssmExpandExpressionTreeNodeAction(treeId, '54');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes[0].isExpanded).toBeTrue();
    });
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmCollapseExpressionTreeNode}'`, () => {
    it(`should set to false the isExpanded property of the node`, () => {
      const treeId = 'demoTree';
      state = updateNgssmExpressionTreeState(state, {
        trees: {
          [treeId]: {
            $set: {
              nodes: [
                {
                  isExpanded: true,
                  path: [],
                  data: {
                    isExpandable: true,
                    id: '54',
                    data: {}
                  }
                }
              ]
            }
          }
        }
      });

      const action = new NgssmCollapseExpressionTreeNodeAction(treeId, '54');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes[0].isExpanded).toBeFalse();
    });
  });
});
