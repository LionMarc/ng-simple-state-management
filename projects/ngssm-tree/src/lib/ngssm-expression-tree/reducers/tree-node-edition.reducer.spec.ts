import { State } from 'ngssm-store';

import {
  NgssmAddExpressionTreeNodeAction,
  NgssmAddExpressionTreeNodesAction,
  NgssmDeleteExpressionTreeNodeAction,
  NgssmExpressionTreeActionType,
  NgssmInitExpressionTreeAction,
  NgssmUpdateExpressionTreeNodeAction
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
            id: 1,
            name: 'node1'
          }
        },
        {
          id: '2',
          parentId: '1',
          isExpandable: true,
          data: {
            id: 2,
            name: 'node2'
          }
        },
        {
          id: '3',
          parentId: '1',
          isExpandable: true,
          data: {
            id: 3,
            name: 'node3'
          }
        },
        {
          id: '4',
          parentId: '3',
          isExpandable: true,
          data: {
            id: 4,
            name: 'node4'
          }
        },
        {
          id: '5',
          isExpandable: true,
          data: {
            id: 5,
            name: 'node5'
          }
        }
      ])
    );
  });

  [
    NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmDeleteExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmAddExpressionTreeNodes
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmAddExpressionTreeNode}'`, () => {
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
              id: 1,
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 2,
              name: 'node2'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 3,
              name: 'node3'
            }
          },
          {
            id: '4',
            parentId: '3',
            isExpandable: true,
            data: {
              id: 4,
              name: 'node4'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              id: 5,
              name: 'node5'
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
              id: 1,
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 2,
              name: 'node2'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 3,
              name: 'node3'
            }
          },
          {
            id: '4',
            parentId: '3',
            isExpandable: true,
            data: {
              id: 4,
              name: 'node4'
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
              id: 5,
              name: 'node5'
            }
          }
        ]);
      });
    });
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmAddExpressionTreeNodes}'`, () => {
    describe(`when no parent node is set`, () => {
      const action = new NgssmAddExpressionTreeNodesAction<TestingData>(treeId, [
        {
          id: 'add001',
          parentId: undefined,
          isExpandable: true,
          data: {
            name: 'list-001'
          }
        },
        {
          id: 'add002',
          parentId: '3',
          isExpandable: true,
          data: {
            name: 'list-002'
          }
        },
        {
          id: 'add003',
          parentId: 'add001',
          isExpandable: true,
          data: {
            name: 'list-003'
          }
        }
      ]);

      it(`should add the nodes to the data object`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['add001']).toEqual({
          name: 'list-001'
        });
        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['add002']).toEqual({
          name: 'list-002'
        });
        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data['add003']).toEqual({
          name: 'list-003'
        });
      });

      it(`should add the nodes to the list of nodes at the right positions`, () => {
        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].nodes.map((n) => n.data)).toEqual([
          {
            id: '1',
            isExpandable: true,
            data: {
              id: 1,
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 2,
              name: 'node2'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 3,
              name: 'node3'
            }
          },
          {
            id: '4',
            parentId: '3',
            isExpandable: true,
            data: {
              id: 4,
              name: 'node4'
            }
          },
          {
            id: 'add002',
            parentId: '3',
            isExpandable: true,
            data: {
              name: 'list-002'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              id: 5,
              name: 'node5'
            }
          },
          {
            id: 'add001',
            parentId: undefined,
            isExpandable: true,
            data: {
              name: 'list-001'
            }
          },
          {
            id: 'add003',
            parentId: 'add001',
            isExpandable: true,
            data: {
              name: 'list-003'
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
              id: 1,
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 2,
              name: 'node2'
            }
          },
          {
            id: '3',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 3,
              name: 'node3'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              id: 5,
              name: 'node5'
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
              id: 1,
              name: 'node1'
            }
          },
          {
            id: '2',
            parentId: '1',
            isExpandable: true,
            data: {
              id: 2,
              name: 'node2'
            }
          },
          {
            id: '5',
            isExpandable: true,
            data: {
              id: 5,
              name: 'node5'
            }
          }
        ]);
      });
    });
  });

  describe(`when processing action of type '${NgssmExpressionTreeActionType.ngssmUpdateExpressionTreeNode}'`, () => {
    it(`should update the store data with the data set in action`, () => {
      const action = new NgssmUpdateExpressionTreeNodeAction(treeId, '3', {
        name: 'updated',
        newProperty: true
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmExpressionTreeState(updatedState).trees[treeId].data).toEqual({
        '3': {
          name: 'updated',
          newProperty: true
        },
        '1': {
          id: 1,
          name: 'node1'
        },
        '2': {
          id: 2,
          name: 'node2'
        },
        '4': {
          id: 4,
          name: 'node4'
        },
        '5': {
          id: 5,
          name: 'node5'
        }
      });
    });
  });
});
