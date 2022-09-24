import { ColumnState } from 'ag-grid-community';

import { ChangeOrigin } from './change-origin';

export interface GridState {
  origin: ChangeOrigin;
  columnsState: ColumnState[];
}
