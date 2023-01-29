import { ColDef } from 'ag-grid-community';

import { ActionConfig } from './action-config';
import { NgssmActionsCellRendererComponent } from './ngssm-actions-cell-renderer.component';

// Parameters of the actions cell renderer
// For now, an action is rendered as a mat-icon-button with the class passed in ActionConfig
export interface NgssmActionsCellRendererParams<TData = any, TValue = any> {
  actions: ActionConfig<TData, TValue>[];
}

export const getNgssmActionsCellColDef = <TData = any, TValue = any>(
  params: NgssmActionsCellRendererParams<TData, TValue>
): Partial<ColDef> => ({
  cellRenderer: NgssmActionsCellRendererComponent,
  cellRendererParams: params
});
