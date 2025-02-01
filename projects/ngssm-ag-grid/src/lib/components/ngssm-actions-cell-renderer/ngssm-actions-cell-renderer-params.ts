import { ColDef } from 'ag-grid-community';

import { ActionConfig } from './action-config';
import { NgssmActionsCellRendererComponent } from './ngssm-actions-cell-renderer.component';

// Parameters of the actions cell renderer
// For now, an action is rendered as a mat-icon-button with the class passed in ActionConfig
export interface NgssmActionsCellRendererParams<TData = unknown, TValue = unknown> {
  actions: ActionConfig<TData, TValue>[];
}

export const getNgssmActionsCellColDef = <TData = unknown, TValue = unknown>(
  params: NgssmActionsCellRendererParams<TData, TValue>
): Partial<ColDef> => ({
  cellRenderer: NgssmActionsCellRendererComponent,
  cellRendererParams: params
});
