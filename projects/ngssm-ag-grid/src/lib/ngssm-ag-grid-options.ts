import { InjectionToken } from '@angular/core';

export class NgssmAgGridOptions {
  theme = 'ag-theme-material';
}

export const NGSSM_AG_GRID_OPTIONS = new InjectionToken<NgssmAgGridOptions>('NGSSM_AG_GRID_OPTIONS');
