import { InjectionToken } from '@angular/core';
import { ColDef, StatusPanelDef } from 'ag-grid-community';

export class NgssmAgGridOptions {
  theme = 'ag-theme-material';
  statusBar:
    | {
        statusPanels: StatusPanelDef[];
      }
    | undefined = undefined;
  defaultColDef: ColDef | undefined = undefined;
}

export const NGSSM_AG_GRID_OPTIONS = new InjectionToken<NgssmAgGridOptions>('NGSSM_AG_GRID_OPTIONS');
