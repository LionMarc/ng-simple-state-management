import { Injectable, inject } from '@angular/core';

import { DataStatus } from 'ngssm-remote-data';
import { Effect, State, Action, Logger, ActionDispatcher } from 'ngssm-store';

import { NgssmTreeActionType, RegisterNodesAction, TreeNodeAction } from '../actions';
import { NgssmTreeDataService, NGSSM_TREE_DATA_SERVICE } from '../model';
import { selectNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeLoadingEffect implements Effect {
  private readonly dataServices: NgssmTreeDataService[] =
    (inject(NGSSM_TREE_DATA_SERVICE, { optional: true }) as unknown as NgssmTreeDataService[]) ?? [];
  private readonly logger = inject(Logger);
  public readonly processedActions: string[] = [
    NgssmTreeActionType.expandNode,
    NgssmTreeActionType.selectNode,
    NgssmTreeActionType.loadChildrenOfNode
  ];

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    const treeNodeAction = action as TreeNodeAction;
    if (!selectNgssmTreeState(state).trees[treeNodeAction.treeId]) {
      this.logger.error(`Trying to process action for tree not initialized: ${treeNodeAction.treeId}.`);
      return;
    }

    const treeType = selectNgssmTreeState(state).trees[treeNodeAction.treeId].type;
    const dataService = (this.dataServices ?? []).find((d) => d.treeType === treeType);
    if (!dataService) {
      this.logger.error(`Trying to process action for tree with no data service: ${treeNodeAction.treeId} / ${treeType}.`);
      return;
    }

    const node = selectNgssmTreeState(state).trees[treeNodeAction.treeId].nodes.find((n) => n.node.nodeId === treeNodeAction.nodeId);
    if (node?.status !== DataStatus.loading) {
      return;
    }

    dataService.load(treeNodeAction.treeId, treeNodeAction.nodeId).subscribe({
      next: (value) =>
        actiondispatcher.dispatchAction(new RegisterNodesAction(DataStatus.loaded, treeNodeAction.treeId, treeNodeAction.nodeId, value)),
      error: (error) => {
        this.logger.error(`Unable to load children nodes for tree '${treeNodeAction.treeId}' and node '${treeNodeAction.nodeId}'`, error);
        actiondispatcher.dispatchAction(new RegisterNodesAction(DataStatus.error, treeNodeAction.treeId, treeNodeAction.nodeId));
      }
    });
  }
}
