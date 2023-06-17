import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { DisplaySearchDialogAction, NgssmTreeActionType, RegisterPartialSearchResultsAction, SearchTreeNodesAction } from '../actions';
import { getNgssmTreeNodeFullPath, getNgssmTreePath, SearchStatus } from '../model';
import { getDefaultTreeNodesSearch, selectNgssmTreeNode, selectNgssmTreeState, updateNgssmTreeState } from '../state';

@Injectable()
export class TreeNodesSearchReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmTreeActionType.displaySearchDialog,
    NgssmTreeActionType.closeSearchDialog,
    NgssmTreeActionType.searchTreeNodes,
    NgssmTreeActionType.registerPartialSearchResults,
    NgssmTreeActionType.abortTreeNodesSearch
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmTreeActionType.displaySearchDialog: {
        const displaySearchDialogAction = action as DisplaySearchDialogAction;
        const path = getNgssmTreePath(
          selectNgssmTreeState(state).trees[displaySearchDialogAction.treeId],
          displaySearchDialogAction.startNodeId
        );
        return updateNgssmTreeState(state, {
          treeNodesSearch: {
            treeId: { $set: displaySearchDialogAction.treeId },
            rootSearchNodeId: { $set: displaySearchDialogAction.startNodeId },
            rootSearchPath: { $set: path.map((p) => p.node.label).join('/') }
          }
        });
      }

      case NgssmTreeActionType.closeSearchDialog: {
        return updateNgssmTreeState(state, {
          treeNodesSearch: { $set: getDefaultTreeNodesSearch() }
        });
      }

      case NgssmTreeActionType.searchTreeNodes: {
        const searchTreeNodesAction = action as SearchTreeNodesAction;
        const startNode = selectNgssmTreeNode(
          state,
          selectNgssmTreeState(state).treeNodesSearch.treeId ?? '',
          selectNgssmTreeState(state).treeNodesSearch.rootSearchNodeId ?? ''
        );
        const toBeProcess: { nodeId: string; fullPath: string }[] = [];
        if (startNode) {
          toBeProcess.push({ nodeId: startNode.node.nodeId, fullPath: getNgssmTreeNodeFullPath(startNode) });
        }

        return updateNgssmTreeState(state, {
          treeNodesSearch: {
            searchPattern: { $set: searchTreeNodesAction.searchPattern },
            searchStatus: { $set: SearchStatus.inProgress },
            toProcess: { $set: toBeProcess },
            matchingNodes: { $set: [] }
          }
        });
      }

      case NgssmTreeActionType.registerPartialSearchResults: {
        const registerPartialSearchResultsAction = action as RegisterPartialSearchResultsAction;
        const toProcess: { nodeId: string; fullPath: string }[] = selectNgssmTreeState(state).treeNodesSearch.toProcess.slice(1);
        toProcess.push(
          ...registerPartialSearchResultsAction.nodesToProcess.map((n) => ({
            nodeId: n.node.nodeId,
            fullPath: getNgssmTreeNodeFullPath(n)
          }))
        );
        return updateNgssmTreeState(state, {
          treeNodesSearch: {
            searchStatus: {
              $apply: (value) => {
                if (toProcess.length === 0) {
                  return SearchStatus.done;
                }

                return value;
              }
            },
            toProcess: { $set: toProcess },
            matchingNodes: { $push: registerPartialSearchResultsAction.matchingNodes.map((n) => n.node.nodeId) }
          }
        });
      }

      case NgssmTreeActionType.abortTreeNodesSearch: {
        return updateNgssmTreeState(state, {
          treeNodesSearch: {
            searchStatus: { $set: SearchStatus.aborted },
            toProcess: { $set: [] }
          }
        });
      }
    }

    return state;
  }
}
