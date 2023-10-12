import { ColDef } from 'ag-grid-community';

export const getColDefWithNoPadding = (): Partial<ColDef> => ({
  cellClass: ['cell-with-no-padding']
});

export const getColDefForEditableColumn = (): Partial<ColDef> => ({
  editable: true,
  headerClass: 'ngssm-ag-editable-cell',
  valueSetter: () => false
});
