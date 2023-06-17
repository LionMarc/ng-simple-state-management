import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmClearExpressionTreeAction, NgssmExpressionTreeActionType, NgssmInitExpressionTreeAction } from '../actions';
import { createNgssmExpressionTreeFromNodes } from '../model';
import { updateNgssmExpressionTreeState } from '../state';

@Injectable()
export class TreesReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmExpressionTreeActionType.ngssmInitExpressionTree,
    NgssmExpressionTreeActionType.ngssmClearExpressionTree
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmExpressionTreeActionType.ngssmInitExpressionTree: {
        const ngssmInitExpressionTreeAction = action as NgssmInitExpressionTreeAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmInitExpressionTreeAction.treeId]: {
              $set: createNgssmExpressionTreeFromNodes(ngssmInitExpressionTreeAction.nodes)
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmClearExpressionTree: {
        const ngssmClearExpressionTreeAction = action as NgssmClearExpressionTreeAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            $unset: [ngssmClearExpressionTreeAction.treeId]
          }
        });
      }
    }

    return state;
  }
}
