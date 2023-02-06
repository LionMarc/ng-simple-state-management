import { ColDef } from 'ag-grid-community';

export const getColDefWithNoPadding = (): Partial<ColDef> => ({
  cellClass: ['cell-with-no-padding']
});
