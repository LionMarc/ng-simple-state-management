import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { Logger, provideEffectFunc, provideReducerFunc, Store } from 'ngssm-store';

import { NGSSM_AG_GRID_OPTIONS, NgssmAgGridOptions } from './ngssm-ag-grid-options';
import { NgssmAgGridAction, NgssmAgGridActionType } from './ngssm-ag-grid-action-type';
import { setAgGridState } from './set-ag-grid-state';
import { setSelectedRows } from './set-selected-rows';
import { saveColumnStatesOnDisk } from './save-column-states-on-disk';
import { restoreColumnStatesFromDisk } from './restore-column-states-from-disk';

/**
 * Loads saved grid states from localStorage at application startup if enabled in options.
 * Dispatches actions to restore grid state for each matching key.
 */
export const loadGridStates = () => {
  const logger = inject(Logger);
  const options = inject(NGSSM_AG_GRID_OPTIONS, { optional: true });
  if (!options?.loadSavedGridStatesAtStartup) {
    logger.information('[ag-grid] No grid state must be loaded at startup.');
    return;
  }

  const store = inject(Store);
  const wantedPrefix = 'ngssm-ag-grid_';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(wantedPrefix)) {
      const gridId = key.slice(wantedPrefix.length);
      logger.information(`[ag-grid] Restoring '${gridId}'.`);
      store.dispatchAction(new NgssmAgGridAction(NgssmAgGridActionType.restoreColumnStatesFromDisk, gridId));
    }
  }
};

/**
 * Provides all necessary providers for NgssmAgGrid, including reducers, effects, options, and grid state loading.
 * @param options Optional configuration for the grid.
 * @returns EnvironmentProviders for NgssmAgGrid.
 */
export const provideNgssmAgGrid = (options?: NgssmAgGridOptions): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(loadGridStates),
    {
      provide: NGSSM_AG_GRID_OPTIONS,
      useValue: options ?? null
    },
    provideReducerFunc([NgssmAgGridActionType.setAgGridState], setAgGridState),
    provideReducerFunc([NgssmAgGridActionType.setSelectedRows], setSelectedRows),
    provideEffectFunc(NgssmAgGridActionType.saveColumnStatesOnDisk, saveColumnStatesOnDisk),
    provideEffectFunc(NgssmAgGridActionType.restoreColumnStatesFromDisk, restoreColumnStatesFromDisk)
  ]);
};
