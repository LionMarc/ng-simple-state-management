import { ColumnState, FilterModel } from 'ag-grid-community';

import { ChangeOrigin } from './change-origin';

export interface GridState {
  origin: ChangeOrigin;
  columnsState: ColumnState[];
  filterModel: FilterModel | null;
}
