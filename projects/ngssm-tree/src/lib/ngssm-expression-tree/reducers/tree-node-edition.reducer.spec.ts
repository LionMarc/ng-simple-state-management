import { State } from 'ngssm-store';

import {
  NgssmAddExpressionTreeNodeAction,
  NgssmDeleteExpressionTreeNodeAction,
  NgssmExpressionTreeActionType,
  NgssmInitExpressionTreeAction
} from '../actions';
import { TreeNodeEditionReducer } from './tree-node-edition.reducer';
import { NgssmExpressionTreeStateSpecification, selectNgssmExpressionTreeState } from '../state';
import { TreesReducer } from './trees.reducer';

interface TestingData {
  name: string;
}

describe('TreeNodeEditionReducer', () => {
  let reducer: TreeNodeEditionReducer;
  let state: State;
  const treeId = 'demo-tree';

  beforeEach(() => {
    reducer = new TreeNodeEditionReducer();
    state = {
      [NgssmExpressionTreeStateSpecification.featureStateKey]: NgssmExpressionTreeStateSpecification.initialState
    };

    state = new TreesReducer().updateState(
      state,
      new NgssmInitExpressionTreeAction(treeId, [
        {
          id: '1',
          isExpandable: true,
          data: {
            name: 'node1'
          }
        },
        {
          id: '2',
          parentId: '1',
          isExpandable: true,
          data: {
            name: 'node1'
          }
        },
        {
          id: '3',
          parentId: '1',
          isExpandable: true,
          data: {
            name: 'node1'
          }
        },
        {
          id: '4',
          parentId: '3',
          isExpandable: true,
          data: {
            name: 'node1'
          }
        },
        {
          id: '5',
          isExpandable: true,
          data: {
            name: 'node1'
          }
        }
      ])
    );
  });

  [NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode, NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode].forEach(
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

  describe(`when processing action of tyep '${NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode}'`, () => {
    describe(`when no parent node is set`, () => {
      const action = new NgssmAddExpressionTreeNodeAction<TestingData>(treeId, {
        id: 'new-node-id',
        isExpandable: true,
        data: {
          name: 'testing'
        }
      });

      it(`should add the node to the data object`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['new-node-id']).toEqual({
          name: 'testing'
        });
      });

      it(`should append the node to the list of nodes`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.data)).toEqual([
          {
            id: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '4',
            parentId: '3',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: 'new-node-id',
            isExpandable: true,
            data: {
              name: 'testing'
            }
          }
        ]);
      });
    });

    describe(`when a parent node is set`, () => {
      const action = new NgssmAddExpressionTreeNodeAction<TestingData>(treeId, {
        id: 'new-node-id',
        parentId: '1',
        isExpandable: true,
        data: {
          name: 'testing'
        }
      });

      it(`should add the node to the data object`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['new-node-id']).toEqual({
          name: 'testing'
        });
      });

      it(`should append the node to the list of children nodes of the associated parent`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.data)).toEqual([
          {
            id: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '4',
            parentId: '3',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: 'new-node-id',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'testing'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          }
        ]);
      });
    });
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode}'`, () => {
    describe(`when node has no child`, () => {
      const action = new NgssmDeleteExpressionTreeNodeAction(treeId, '4');

      it(`should remove the node from the data object`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['4']).toBeUndefined();
      });

      it(`should remove the node from the list of nodes`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.data)).toEqual([
          {
            id: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          }
        ]);
      });
    });

    describe(`when node has children`, () => {
      const action = new NgssmDeleteExpressionTreeNodeAction(treeId, '3');

      it(`should remove the node and its childrenfrom the data object`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['3']).toBeUndefined();
        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['4']).toBeUndefined();
      });

      it(`should remove the node from the list of nodes`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.data)).toEqual([
          {
            id: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              name: 'node1'
            }
          }
        ]);
      });
    });
  });
});
