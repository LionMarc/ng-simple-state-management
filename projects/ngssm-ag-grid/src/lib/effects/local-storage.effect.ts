import { inject, Injectable } from '@angular/core';

import { Effect, State, Action, Logger, ActionDispatcher } from 'ngssm-store';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';

@Injectable()
export class LocalStorageEffect implements Effect {
  private readonly logger = inject(Logger);

  public readonly processedActions: string[] = [AgGridActionType.savecolumnStatesOnDisk, AgGridActionType.resetcolumnStatesFromDisk];

  public processAction(actiondispatcher: ActionDispatcher, state: State, action: Action): void {
    const agGridAction = action as AgGridAction;

    switch (action.type) {
      case AgGridActionType.savecolumnStatesOnDisk: {
        const gridState = selectAgGridState(state).gridStates[agGridAction.gridId];
        if (gridState) {
          localStorage.setItem(this.getcolumnStatesLocalStorageKey(agGridAction.gridId), JSON.stringify(gridState.columnStates));
          localStorage.setItem(this.getcolumnGroupStatesLocalStorageKey(agGridAction.gridId), JSON.stringify(gridState.columnGroupStates));
          if (gridState.filterModel) {
            localStorage.setItem(this.getFilterModelLocalStorageKey(agGridAction.gridId), JSON.stringify(gridState.filterModel));
          }
        }

        break;
      }

      case AgGridActionType.resetcolumnStatesFromDisk: {
        const stored = localStorage.getItem(this.getcolumnStatesLocalStorageKey(agGridAction.gridId));
        const columnGroupStates = localStorage.getItem(this.getcolumnGroupStatesLocalStorageKey(agGridAction.gridId));
        const filterModelStored = localStorage.getItem(this.getFilterModelLocalStorageKey(agGridAction.gridId));
        console.log(stored, filterModelStored);
        if (stored) {
          try {
            const columnStates = JSON.parse(stored);
            if (Array.isArray(columnStates)) {
              const action = new RegisterAgGridStateAction(
                agGridAction.gridId,
                ChangeOrigin.other,
                columnStates,
                columnGroupStates ? JSON.parse(columnGroupStates) : [],
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

  private getcolumnStatesLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_${gridId}`;
  }

  private getcolumnGroupStatesLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_groups_${gridId}`;
  }

  private getFilterModelLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_filters_${gridId}`;
  }
}
