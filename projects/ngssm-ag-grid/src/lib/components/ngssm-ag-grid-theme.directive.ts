import { Directive, HostBinding, inject } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { NgssmAgGridOptions, NGSSM_AG_GRID_OPTIONS } from '../ngssm-ag-grid-options';

@Directive({
  selector: '[ngssmAgGridTheme]'
})
export class NgssmAgGridThemeDirective {
  @HostBinding('class') className = '';

  private readonly options: NgssmAgGridOptions | null = inject(NGSSM_AG_GRID_OPTIONS, { optional: true });
  private agGridAngular = inject(AgGridAngular);

  constructor() {
    this.className = (this.options ?? new NgssmAgGridOptions()).theme;
    if (this.agGridAngular.statusBar === undefined) {
      this.agGridAngular.statusBar = this.options?.statusBar;
    }

    if (this.agGridAngular.defaultColDef === undefined) {
      this.agGridAngular.defaultColDef = this.options?.defaultColDef;
    }
  }
}
