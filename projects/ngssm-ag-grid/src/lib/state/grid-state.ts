import { ColumnState, FilterModel } from 'ag-grid-community';

import { ChangeOrigin } from './change-origin';

export interface ColumnGroupState {
  groupId: string;
  open: boolean;
}

export interface GridState {
  origin: ChangeOrigin;
  columnStates: ColumnState[];
  filterModel: FilterModel | null;
  columnGroupStates: ColumnGroupState[];
}
