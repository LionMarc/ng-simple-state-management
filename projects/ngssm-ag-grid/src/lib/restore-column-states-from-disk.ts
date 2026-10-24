import { inject } from '@angular/core';

import { EffectFunc, Logger, Store } from 'ngssm-store';

import { NgssmAgGridAction } from './ngssm-ag-grid-action-type';
import {
  getcolumnGroupStatesLocalStorageKey,
  getColumnStatesLocalStorageKey,
  getFilterModelLocalStorageKey
} from './save-column-states-on-disk';
import { NgssmSetAgGridStateAction } from './set-ag-grid-state';
import { ChangeOrigin } from './state';

export const restoreColumnStatesFromDisk: EffectFunc<NgssmAgGridAction> = (_, action) => {
  const stored = localStorage.getItem(getColumnStatesLocalStorageKey(action.gridId));
  const columnGroupStates = localStorage.getItem(getcolumnGroupStatesLocalStorageKey(action.gridId));
  const filterModelStored = localStorage.getItem(getFilterModelLocalStorageKey(action.gridId));
  const store = inject(Store);
  const logger = inject(Logger);
  if (stored) {
    try {
      const columnStates = JSON.parse(stored);
      if (Array.isArray(columnStates)) {
        const actionToDispatch = new NgssmSetAgGridStateAction(
          action.gridId,
          ChangeOrigin.other,
          columnStates,
          columnGroupStates ? JSON.parse(columnGroupStates) : [],
          filterModelStored ? JSON.parse(filterModelStored) : null
        );
        store.dispatchAction(actionToDispatch);
      } else {
        logger.error(`Wrong columns state config for grid '${action.gridId}'`, stored);
      }
    } catch (error) {
      logger.error(`Unable to load config for grid '${action.gridId}'`, error);
    }
  }
};
