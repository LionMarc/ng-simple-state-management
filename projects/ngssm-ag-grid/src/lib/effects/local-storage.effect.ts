import { Injectable, Provider } from '@angular/core';

import { Effect, Store, State, Action, NGSSM_EFFECT } from 'ngssm-store';
import { Logger } from 'ngssm-toolkit';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';

@Injectable()
export class LocalStorageEffect implements Effect {
  public readonly processedActions: string[] = [AgGridActionType.saveColumnsStateOnDisk, AgGridActionType.resetColumnsStateFromDisk];

  constructor(private logger: Logger) {}

  public processAction(store: Store, state: State, action: Action): void {
    const agGridAction = action as AgGridAction;

    switch (action.type) {
      case AgGridActionType.saveColumnsStateOnDisk:
        const columnsState = selectAgGridState(state).gridStates[agGridAction.gridId];
        if (columnsState) {
          localStorage.setItem(this.getColumnsStateLocalStorageKey(agGridAction.gridId), JSON.stringify(columnsState.columnsState));
        }

        break;

      case AgGridActionType.resetColumnsStateFromDisk:
        const stored = localStorage.getItem(this.getColumnsStateLocalStorageKey(agGridAction.gridId));
        if (stored) {
          try {
            const columnsState = JSON.parse(stored);
            if (Array.isArray(columnsState)) {
              store.dispatchAction(new RegisterAgGridStateAction(agGridAction.gridId, ChangeOrigin.other, columnsState));
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

  private getColumnsStateLocalStorageKey(gridId: string): string {
    return `ngssm-ag-grid_${gridId}`;
  }
}

export const localStorageEffectProvider: Provider = {
  provide: NGSSM_EFFECT,
  useClass: LocalStorageEffect,
  multi: true
};
