import { inject, Injectable } from '@angular/core';

import { Effect, State, Action, Logger, ActionDispatcher } from 'ngssm-store';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';

@Injectable()
export class LocalStorageEffect implements Effect {
  private readonly logger = inject(Logger);

  public readonly processedActions: string[] = [AgGridActionType.saveColumnsStateOnDisk, AgGridActionType.resetColumnsStateFromDisk];

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    const agGridAction = action as AgGridAction;

    switch (action.type) {
      case AgGridActionType.saveColumnsStateOnDisk: {
        const gridState = selectAgGridState(state).gridStates[agGridAction.gridId];
        if (gridState) {
          localStorage.setItem(this.getColumnsStateLocalStorageKey(agGridAction.gridId), JSON.stringify(gridState.columnsState));
          if (gridState.filterModel) {
            localStorage.setItem(this.getFilterModelLocalStorageKey(agGridAction.gridId), JSON.stringify(gridState.filterModel));
          }
        }

        break;
      }

      case AgGridActionType.resetColumnsStateFromDisk: {
        const stored = localStorage.getItem(this.getColumnsStateLocalStorageKey(agGridAction.gridId));
        const filterModelStored = localStorage.getItem(this.getFilterModelLocalStorageKey(agGridAction.gridId));
        console.log(stored, filterModelStored);
        if (stored) {
          try {
            const columnsState = JSON.parse(stored);
            if (Array.isArray(columnsState)) {
              const action = new RegisterAgGridStateAction(
                agGridAction.gridId,
                ChangeOrigin.other,
                columnsState,
                filterModelStored ? JSON.parse(filterModelStored) : null
              );
              actiondispatcher.dispatchAction(action);
            } else {
              this.logger.error(`Wrong columns state config for grid '${agGridAction.gridId}'`, stored);
            }
          } catch (error) {
            this.logger.error(`Unable to load config for grid '${agGridAction.gridId}'`, error);
          }
        }

        break;
      }
    }
  }

  private getColumnsStateLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_${gridId}`;
  }

  private getFilterModelLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_filters_${gridId}`;
  }
}
