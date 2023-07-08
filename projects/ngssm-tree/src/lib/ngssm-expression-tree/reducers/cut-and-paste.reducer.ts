import { Injectable } from '@angular/core';

import update from 'immutability-helper';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmCancelCutExpressionTreeNodeAction,
  NgssmCutExpressionTreeNodeAction,
  NgssmExpressionTreeActionType,
  NgssmPasteExpressionTreeNodeAction
} from '../actions';
import { selectNgssmExpressionTreeState, updateNgssmExpressionTreeState } from '../state';
import { NgssmExpressionTreeNode } from '../model';

@Injectable()
export class CutAndPasteReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmExpressionTreeActionType.ngssmCutExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmCancelCutExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmPasteExpressionTreeNode
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmExpressionTreeActionType.ngssmCutExpressionTreeNode: {
        const ngssmCutExpressionTreeNodeAction = action as NgssmCutExpressionTreeNodeAction;
        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmCutExpressionTreeNodeAction.treeId]: {
              nodeCut: {
                $set: selectNgssmExpressionTreeState(state).trees[ngssmCutExpressionTreeNodeAction.treeId]?.nodes.find(
                  (n) => n.data.id === ngssmCutExpressionTreeNodeAction.nodeId
                )
              }
            }
          }
        });
      }

      case NgssmExpressionTreeActionType.ngssmCancelCutExpressionTreeNode: {
        const ngssmCancelCutExpressionTreeNodeAction = action as NgssmCancelCutExpressionTreeNodeAction;
        return this.resetCutAndPaste(state, ngssmCancelCutExpressionTreeNodeAction.treeId);
      }

      case NgssmExpressionTreeActionType.ngssmPasteExpressionTreeNode: {
        const ngssmPasteExpressionTreeNodeAction = action as NgssmPasteExpressionTreeNodeAction;
        const tree = selectNgssmExpressionTreeState(state).trees[ngssmPasteExpressionTreeNodeAction.treeId];
        const cutNode = tree.nodeCut;
        if (!cutNode) {
          return state;
        }

        const currentIndex = tree.nodes.findIndex((n) => n.data.id === cutNode.data.id);
        if (currentIndex === -1) {
          return this.resetCutAndPaste(state, ngssmPasteExpressionTreeNodeAction.treeId);
        }

        const targetNode = tree.nodes.find((n) => n.data.id === ngssmPasteExpressionTreeNodeAction.nodeId);
        if (!targetNode) {
          return this.resetCutAndPaste(state, ngssmPasteExpressionTreeNodeAction.treeId);
        }

        let targetIndex = tree.nodes.findIndex((n) => n.data.id === ngssmPasteExpressionTreeNodeAction.nodeId);
        if (ngssmPasteExpressionTreeNodeAction.target === 'Inside') {
          targetIndex = targetIndex + 1;
        } else {
          for (let index = targetIndex; index < tree.nodes.length; index++) {
            if (!(tree.nodes[index + 1]?.path ?? []).includes(ngssmPasteExpressionTreeNodeAction.nodeId)) {
              targetIndex = index + 1;
              break;
            }
          }
        }

        const newBasePath =
          ngssmPasteExpressionTreeNodeAction.target === 'After' ? targetNode.path : [...targetNode.path, targetNode.data.id];
        const pathPartsToRemove = cutNode.path.length;
        if (newBasePath === cutNode.path && currentIndex === targetIndex) {
          return this.resetCutAndPaste(state, ngssmPasteExpressionTreeNodeAction.treeId);
        }

        const movedNode = update(cutNode, {
          path: { $set: newBasePath },
          data: {
            parentId: { $set: ngssmPasteExpressionTreeNodeAction.target === 'After' ? targetNode.data.parentId : targetNode.data.id }
          }
        });

        const nodesToMove: NgssmExpressionTreeNode[] = tree.nodes
          .filter((n) => n.path.includes(cutNode.data.id))
          .map((node) => ({
            ...node,
            path: [...newBasePath, ...node.path.slice(pathPartsToRemove)]
          }));

        return updateNgssmExpressionTreeState(state, {
          trees: {
            [ngssmPasteExpressionTreeNodeAction.treeId]: {
              nodes: {
                $apply: (nodes: NgssmExpressionTreeNode[]) => {
                  let output = [...nodes];
                  if (targetIndex > currentIndex) {
                    output.splice(targetIndex, 0, movedNode, ...nodesToMove);
                    output.splice(currentIndex, nodesToMove.length + 1);
                    return output;
                  }

                  output.splice(currentIndex, nodesToMove.length + 1);
                  output.splice(targetIndex, 0, movedNode, ...nodesToMove);

                  return output;
                }
              },
              nodeCut: { $set: undefined }
            }
          }
        });
      }
    }

    return state;
  }

  private resetCutAndPaste(state: State, treeId: string): State {
    return updateNgssmExpressionTreeState(state, {
      trees: {
        [treeId]: { $unset: ['nodeCut'] }
      }
    });
  }
}
