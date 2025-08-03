import { InjectionToken } from '@angular/core';
import { ColDef, StatusPanelDef } from 'ag-grid-community';

/**
 * Configuration options for NgssmAgGrid.
 * - theme: The CSS theme to use for the grid.
 * - statusBar: Optional status bar configuration for AG Grid.
 * - defaultColDef: Optional default column definition for all columns.
 * - loadSavedGridStatesAtStartup: If true, grid states saved in local storage are loaded during app initialization.
 */
export class NgssmAgGridOptions {
  theme = 'ag-theme-material';
  statusBar:
    | {
        statusPanels: StatusPanelDef[];
      }
    | undefined = undefined;
  defaultColDef: ColDef | undefined = undefined;
  loadSavedGridStatesAtStartup?: boolean = undefined;
}

/**
 * Injection token for providing NgssmAgGridOptions in Angular DI.
 *
 * Provide options through the provideNgssmAgGrid function instead of using this token.
 */
export const NGSSM_AG_GRID_OPTIONS = new InjectionToken<NgssmAgGridOptions>('NGSSM_AG_GRID_OPTIONS');
