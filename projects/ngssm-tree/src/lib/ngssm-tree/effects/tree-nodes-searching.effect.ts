import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DataStatus } from 'ngssm-remote-data';
import { Effect, Store, State, Action, Logger } from 'ngssm-store';
import { defaultRegexEditorValidator } from 'ngssm-toolkit';

import { LoadChildrenOfNodeAction, NgssmTreeActionType, RegisterPartialSearchResultsAction } from '../actions';
import { NgssmTreeSearchDialogComponent } from '../components';
import { NgssmTreeNode, SearchStatus } from '../model';
import { selectNgssmTreeNode, selectNgssmTreeNodeChildren, selectNgssmTreeState } from '../state';

@Injectable()
export class TreeNodesSearchingEffect implements Effect {
  private dialog: MatDialogRef<NgssmTreeSearchDialogComponent> | undefined;

  public readonly processedActions: string[] = [
    NgssmTreeActionType.displaySearchDialog,
    NgssmTreeActionType.closeSearchDialog,
    NgssmTreeActionType.searchTreeNodes,
    NgssmTreeActionType.registerNodes,
    NgssmTreeActionType.registerPartialSearchResults
  ];

  constructor(
    private matDialog: MatDialog,
    private logger: Logger
  ) {}

  public processAction(store: Store, state: State, action: Action): void {
    switch (action.type) {
      case NgssmTreeActionType.displaySearchDialog: {
        this.dialog = this.matDialog.open(NgssmTreeSearchDialogComponent, {
          disableClose: true,
          width: '80vw',
          height: '80vh'
        });

        break;
      }

      case NgssmTreeActionType.closeSearchDialog: {
        this.closeDialog();

        break;
      }

      case NgssmTreeActionType.searchTreeNodes:
      case NgssmTreeActionType.registerNodes:
      case NgssmTreeActionType.registerPartialSearchResults: {
        const searchState = selectNgssmTreeState(state).treeNodesSearch;
        if (!searchState.treeId || !searchState.rootSearchNodeId || searchState.searchStatus !== SearchStatus.inProgress) {
          return;
        }

        if (searchState.toProcess.length === 0) {
          return;
        }

        const currentNode = selectNgssmTreeNode(state, searchState.treeId, searchState.toProcess[0].nodeId);
        if (!currentNode) {
          this.logger.error(`No node for treeId '${searchState.treeId}' with id '${searchState.toProcess[0].nodeId}'.`);
          return;
        }

        if (currentNode.node.isExpandable && currentNode.status !== DataStatus.loaded && currentNode.status !== DataStatus.loading) {
          store.dispatchAction(new LoadChildrenOfNodeAction(searchState.treeId, currentNode.node.nodeId));
          return;
        }

        const childrenNodes = selectNgssmTreeNodeChildren(state, searchState.treeId, currentNode.node.nodeId);
        const matching: NgssmTreeNode[] = [];
        const toProcess: NgssmTreeNode[] = [];
        childrenNodes.forEach((node) => {
          const fullPath = `${node.parentFullPath}/${node.node.label}`;
          if (defaultRegexEditorValidator.isMatch(searchState.searchPattern ?? '', fullPath)) {
            matching.push(node);
          }

          if (node.node.isExpandable) {
            toProcess.push(node);
          }
        });

        store.dispatchAction(new RegisterPartialSearchResultsAction(matching, toProcess));

        break;
      }
    }
  }

  private closeDialog(): void {
    this.dialog?.close();
    this.dialog = undefined;
  }
}
