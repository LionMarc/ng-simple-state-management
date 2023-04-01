import { Inject, Injectable, Optional, Provider } from '@angular/core';

import { DataStatus } from 'ngssm-remote-data';
import { Effect, Store, State, Action, NGSSM_EFFECT, Logger } from 'ngssm-store';

import { NgssmTreeActionType, RegisterNodesAction, TreeNodeAction } from '../actions';
import { NgssmTreeDataService, NGSSM_TREE_DATA_SERVICE } from '../model';
import { selectNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeLoadingEffect implements Effect {
  public readonly processedActions: string[] = [
    NgssmTreeActionType.expandNode,
    NgssmTreeActionType.selectNode,
    NgssmTreeActionType.loadChildrenOfNode
  ];

  constructor(@Inject(NGSSM_TREE_DATA_SERVICE) @Optional() private dataServices: NgssmTreeDataService[], private logger: Logger) {}

  public processAction(store: Store, state: State, action: Action): void {
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
        store.dispatchAction(new RegisterNodesAction(DataStatus.loaded, treeNodeAction.treeId, treeNodeAction.nodeId, value)),
      error: (error) => {
        this.logger.error(`Unable to load children nodes for tree '${treeNodeAction.treeId}' and node '${treeNodeAction.nodeId}'`, error);
        store.dispatchAction(new RegisterNodesAction(DataStatus.error, treeNodeAction.treeId, treeNodeAction.nodeId));
      }
    });
  }
}

export const treeNodeLoadingEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: TreeNodeLoadingEffect,
  multi: true
};
