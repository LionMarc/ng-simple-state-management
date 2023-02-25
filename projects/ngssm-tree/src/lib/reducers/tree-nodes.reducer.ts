import { Injectable, Provider } from '@angular/core';

import update from 'immutability-helper';
import { DataStatus } from 'ngssm-remote-data';

import { Reducer, State, Action, NGSSM_REDUCER } from 'ngssm-store';

import { NgssmTreeActionType, RegisterNodesAction } from '../actions';
import { NgssmTreeNode } from '../model';
import { updateNgssmTreeState } from '../state';

@Injectable()
export class TreeNodesReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmTreeActionType.registerNodes];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.registerNodes: {
        const registerNodesAction = action as RegisterNodesAction;
        return updateNgssmTreeState(state, {
          trees: {
            [registerNodesAction.treeId]: {
              nodes: {
                $apply: (nodes: NgssmTreeNode[]) => {
                  const index = nodes.findIndex((n) => n.node.nodeId === registerNodesAction.parentNodeId);
                  if (index === -1) {
                    return nodes;
                  }

                  return [
                    ...nodes.slice(0, index),
                    update(nodes[index], { status: { $set: registerNodesAction.dataStatus } }),
                    ...registerNodesAction.nodes.map((i) => ({
                      status: DataStatus.none,
                      isExpanded: false,
                      level: nodes[index].level + 1,
                      node: i,
                      parentFullPath:
                        nodes[index].parentFullPath !== undefined
                          ? `${nodes[index].parentFullPath}/${nodes[index].node.label}`
                          : nodes[index].node.label
                    })),
                    ...nodes.slice(index + 1)
                  ];
                }
              }
            }
          }
        });
      }
    }

    return state;
  }
}

export const treeNodesReducerProvider: Provider = {
  provide: NGSSM_REDUCER,
  useClass: TreeNodesReducer,
  multi: true
};
