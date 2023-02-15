import { DataStatus } from 'ngssm-remote-data';

import { CollapseNodeAction, ExpandNodeAction, NgssmTreeActionType } from '../actions';
import { NgssmTreeStateSpecification, selectNgssmTreeState, updateNgssmTreeState } from '../state';
import { TreeNodeExpandReducer } from './tree-node-expand.reducer';

describe('TreeNodeExpandReducer', () => {
  let reducer: TreeNodeExpandReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new TreeNodeExpandReducer();
    state = {
      [NgssmTreeStateSpecification.featureStateKey]: NgssmTreeStateSpecification.initialState
    };

    state = updateNgssmTreeState(state, {
      trees: {
        testing: { $set: { type: 'Testing', nodes: [] } }
      }
    });
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

  describe(`when processing action of type '${NgssmTreeActionType.expandNode}'`, () => {
    beforeEach(() => {
      state = updateNgssmTreeState(state, {
        trees: {
          testing: {
            nodes: {
              $set: [
                {
                  status: DataStatus.loaded,
                  isExpanded: true,
                  level: 0,
                  node: {
                    nodeId: '0',
                    label: 'Root',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                },
                {
                  status: DataStatus.none,
                  isExpanded: false,
                  level: 1,
                  node: {
                    nodeId: '1',
                    parentNodeId: '0',
                    label: '01',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                },
                {
                  status: DataStatus.loaded,
                  isExpanded: false,
                  level: 1,
                  node: {
                    nodeId: '2',
                    parentNodeId: '0',
                    label: '02',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                }
              ]
            }
          }
        }
      });
    });

    describe(`when node status is '${DataStatus.none}'`, () => {
      it(`should set the isExpanded property of the node to undefined`, () => {
        const action = new ExpandNodeAction('testing', '1');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmTreeState(updatedState).trees['testing'].nodes[1].isExpanded).toEqual(undefined);
      });

      it(`should set the status to '${DataStatus.loading}'`, () => {
        const action = new ExpandNodeAction('testing', '1');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmTreeState(updatedState).trees['testing'].nodes[1].status).toEqual(DataStatus.loading);
      });
    });

    describe(`when node status is '${DataStatus.loaded}'`, () => {
      it(`should set the isExpanded property of the node to true`, () => {
        const action = new ExpandNodeAction('testing', '2');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmTreeState(updatedState).trees['testing'].nodes[2].isExpanded).toBeTrue();
      });

      it(`should let the status to '${DataStatus.loaded}'`, () => {
        const action = new ExpandNodeAction('testing', '2');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmTreeState(updatedState).trees['testing'].nodes[2].status).toEqual(DataStatus.loaded);
      });
    });
  });

  describe(`when processing action of type '${NgssmTreeActionType.collapseNode}'`, () => {
    beforeEach(() => {
      state = updateNgssmTreeState(state, {
        trees: {
          testing: {
            nodes: {
              $set: [
                {
                  status: DataStatus.loaded,
                  isExpanded: true,
                  level: 0,
                  node: {
                    nodeId: '0',
                    label: 'Root',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                },
                {
                  status: DataStatus.none,
                  isExpanded: true,
                  level: 1,
                  node: {
                    nodeId: '1',
                    parentNodeId: '0',
                    label: '01',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                },
                {
                  status: DataStatus.loaded,
                  isExpanded: false,
                  level: 1,
                  node: {
                    nodeId: '2',
                    parentNodeId: '0',
                    label: '02',
                    type: 'folder',
                    isExpandable: true,
                    data: {}
                  }
                }
              ]
            }
          }
        }
      });
    });

    it(`should set the isExpanded property of the node to false`, () => {
      const action = new CollapseNodeAction('testing', '1');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmTreeState(updatedState).trees['testing'].nodes[1].isExpanded).toBeFalse();
    });
  });
});
