import { Inject, Injectable, Provider } from '@angular/core';

import { DataStatus } from 'ngssm-remote-data';
import { Effect, Store, State, Action, NGSSM_EFFECT, Logger } from 'ngssm-store';

import { ExpandNodeAction, NgssmTreeActionType, RegisterNodesAction } from '../actions';
import { NgssmTreeDataService, NGSSM_TREE_DATA_SERVICE } from '../model';
import { selectNgssmTreeState } from '../state';

@Injectable()
export class TreeNodeLoadingEffect implements Effect {
  public readonly processedActions: string[] = [NgssmTreeActionType.expandNode];

  constructor(@Inject(NGSSM_TREE_DATA_SERVICE) private dataService: NgssmTreeDataService, private logger: Logger) {}

  public processAction(store: Store, state: State, action: Action): void {
    const expandNodeAction = action as ExpandNodeAction;
    const node = selectNgssmTreeState(state).trees[expandNodeAction.treeId].find((n) => n.id === expandNodeAction.nodeId);
    if (node?.status !== DataStatus.loading) {
      return;
    }

    this.dataService.load(expandNodeAction.treeId, expandNodeAction.nodeId).subscribe({
      next: (value) =>
        store.dispatchAction(new RegisterNodesAction(DataStatus.loaded, expandNodeAction.treeId, expandNodeAction.nodeId, value)),
      error: (error) => {
        this.logger.error(
          `Unable to load children nodes for tree '${expandNodeAction.treeId}' and node '${expandNodeAction.nodeId}'`,
          error
        );
        store.dispatchAction(new RegisterNodesAction(DataStatus.error, expandNodeAction.treeId, expandNodeAction.nodeId));
      }
    });
  }
}

export const treeNodeLoadingEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: TreeNodeLoadingEffect,
  multi: true
};
