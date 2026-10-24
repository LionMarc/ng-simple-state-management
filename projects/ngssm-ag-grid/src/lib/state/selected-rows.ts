import { computed, inject, Signal } from '@angular/core';

import { Store } from 'ngssm-store';

import { ChangeOrigin } from './change-origin';
import { selectNgssmAgGridState } from './ngssm-ag-grid.state';

export interface SelectedRows {
  origin: ChangeOrigin;
  ids: string[];
}

export const selectedRowsIdsSignal = (gridId: string | Signal<string>): Signal<string[]> => {
  const store = inject(Store);
  const gridIdSignal = computed(() => (typeof gridId === 'string' ? gridId : gridId()));

  return computed(() => selectNgssmAgGridState(store.state()).selectedRows[gridIdSignal()]?.ids ?? []);
};
